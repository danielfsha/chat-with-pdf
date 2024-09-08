import { ChatOpenAI } from '@langchain/openai';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'; 
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { createRetrievalChain } from "langchain/chains/retrieval"
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever"
import { HumanMessage, AIMessage } from '@langchain/core/messages';

import { PineconeStore } from '@langchain/pinecone';
import { PineconeConflictError } from '@pinecone-database/pinecone/dist/errors'
import { Index, RecordMetadata } from '@pinecone-database/pinecone'

import pineconeClient from './pincone';

import { adminDB } from '@/firebaseAdmin';
import { auth } from '@clerk/nextjs/server';

import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
const model = new ChatGoogleGenerativeAI({
  modelName: "gemini-pro",
  apiKey: process.env.GEMINI_API_KEY,
  maxOutputTokens: 2048,
});

// export const indexName = 'pdf-chat';
export const indexName = 'pdf-chat-google';

async function nameSpaceExists(index: Index<RecordMetadata>, namespace: string) {
    if (namespace == null) throw new Error('Namespace is null');
    const  {namespaces} = await index.describeIndexStats();
    return namespaces?.[namespace] != null;
}

async function fetchChatHistory(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('User not logged in');
  }

  const ref = await adminDB
    .collection('users')
    .doc(userId)
    .collection('files')
    .doc(docId)
    .collection('chat')
    .orderBy('createdAt', 'desc')
    .get();

  const chatHistory = await ref.docs.map((doc) => {
    return doc.data().role == 'Human' ? new HumanMessage(doc.data().message) : new AIMessage(doc.data().message);
  });

  return chatHistory;
}

async function generateDocs(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('User not logged in');
  }

  try {
    // Fetch the pdf file from the storage bucket
    const firebaseRef = await adminDB
      .collection('users')
      .doc(userId)
      .collection('files')
      .doc(docId)
      .get();

    const fileDownloadUrl = await firebaseRef.data()?.url;

    if (!fileDownloadUrl) {
      throw new Error('File not found');
    }

    console.log('Download file from storage bucket successfully:', fileDownloadUrl);

    const response = await fetch(fileDownloadUrl);

    if (!response.ok) {
      throw new Error(`Network error fetching file: ${response.statusText}`);
    }

    // Convert blob to a format compatible with PDFLoader (check its documentation)
    const data = await response.blob();

    console.log('loading pdf file...');
    const loader = new PDFLoader(data); // Assuming PDFLoader accepts arrayBuffer
    const docs = await loader.load();

    console.log('Splitting documents...');
    const splitter = new RecursiveCharacterTextSplitter();

    const splitDocs = await splitter.splitDocuments(docs);
    console.log(`Split ${splitDocs.length} documents`);

    return splitDocs;
  } catch (error) {
    console.error('Error generating documents:', error);
    // Handle the error appropriately (e.g., display an error message to the user)
    throw error; // Re-throw the error for further handling
  }
}


export async function generateEmbeddingsInPineconeVectorStore(docId: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error('User not logged in')
    }

    let pineconeVectorStore;

    // 1. Generate embeddings for the document
    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY,
        model: "embedding-001"
    });
    // const embeddings = new OpenAIEmbeddings();
    console.log('Generating embeddings...');

    // 2. Create a connection to the Pinecone vector store
    const index = await pineconeClient.Index(indexName);
    console.log('Connecting to Pinecone...');

    // 3.check if namespace exists, since we are limited to 100 namespaces only on our free tier.
    // You can use namespaces to partition your data in the index. Namespaces are useful when you want to query over huge amount of data, and you want to partition the data to make the queries faster. When you use namespaces, there won't be post-filtering on the results which will make the query results more precise.
    // due to our limited free tier, we want to make sure we don't exceed the limit of 100 namespaces. so we will create a checker function to see if the namespace exists. if it doesn't exist, we will create it. if it does exist, we will just use it.
    const  namespaceExists = await nameSpaceExists(index, docId);


    // 4. Create a namespace for the index if it doesn't exist. And use it if it does exist.
    if (namespaceExists) {
        console.log('Namespace already exists so we will use it');

        pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
            pineconeIndex: index,
            namespace: docId,
        });

        return pineconeVectorStore;
    } else {
        // since the namespace doesn't exist, we will create it. after downloading the pdf, we wll break it into chunks and then we will create a namespace for it.
        console.log('Creating namespace...');
        const splitDocs = await generateDocs(docId);

        console.log(`storing the embeddings in ${docId} in the ${indexName} pinecone vector store...`);
        pineconeVectorStore = await PineconeStore.fromDocuments(splitDocs, embeddings, {
            pineconeIndex: index,
            namespace: docId,
        });

        return pineconeVectorStore;
    }
}

export async function generateLangchainChatCompletion(docId: string, question: string) {
  let pineconeVectorStore;

  pineconeVectorStore = await generateEmbeddingsInPineconeVectorStore(docId);
  
  console.log('Retrieving documents from Pinecone...');

  if (!pineconeVectorStore) {
    throw new Error('Pinecone vector store not found');
  }

  const retriever = pineconeVectorStore.asRetriever();

  const chatHistory = await fetchChatHistory(docId);

  const histotyAwarePrompt = ChatPromptTemplate.fromMessages([
    ...chatHistory,

    ["user", "{input}"],
    [
      'user',
      'Given the above conversation and document, answer the following question: {input} consicely.'
    ]
  ]);

  const histotyAwareRetrieverChain = await createHistoryAwareRetriever({
    llm: model,
    retriever,
    rephrasePrompt: histotyAwarePrompt
  });

  console.log('Retrieving documents from Pinecone...');

  const historyAwareRetrieverPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a helpful assistant. Answer the user question in short and consice manner as based on the conversation and {context}."
    ],

    ...chatHistory,
    ["user", "{input}"],
  ])


  console.log('create documen combine chain...');

  const historyAwareCombineChain = await createStuffDocumentsChain({
    llm: model,
    prompt: historyAwareRetrieverPrompt,
  })


  console.log('create the main retrieval chain...');
  const conversationRetrievalChain = await createRetrievalChain({
    retriever: pineconeVectorStore.asRetriever(),
    combineDocsChain: historyAwareCombineChain,
  });

  console.log('run the chain with the conversation...');
  const reply = await conversationRetrievalChain.invoke({
    chat_history: chatHistory,
    input: question,
  });


  console.log('reply:', reply.answer);
  return reply.answer;
}