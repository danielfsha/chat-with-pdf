### GENERATE EMBEDDINGs
pinecone is a vector database that stores embeddings of documents. it is a serverless vector database that can be used to store embeddings of documents and then use them to retrieve the most similar documents to a given document.

create a new folder and call it actions, inside it create a file called generateEmbeddings.ts and 
start with the following code:

```typescript
"use server"

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from 'next/cache'

export async function generateEmbeddings(docId: string) {
    auth().protect()

    await generateEmbeddingsInPineconeVectorStore(docId)

    revalidatePath("/dashboard")

    return {
        completed: true,
    }
}
```

Head over to the [Pinecone](https://app.pinecone.io/) website and create a new index.
install the pinecone-client package:

```bash
npm install @pinecone-database/pinecone
```

create a new file called pinecone.ts under your lib folder and add the following code:

```typescript
import { Pinecone } from "@pinecone-database/pinecone";

if (!process.env.PINECONE_API_KEY) {
    throw new Error("PINECONE_API_KEY is not set");
}

const pineconeClient  = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
})

export default pineconeClient
```

to create index head over to the [Pinecone](https://app.pinecone.io/) website and click on create a new index button.  
1. for the index name used: pdf-chat.
2. and for the dimension: 1536. since its the one compatable with the embeddings generated by the text-embedding-ada-002 model.
3. choose serverless 
4. aws as provider
5. us-east-1(virginia) as region
6. and click on create index button.



## langchain
langchain is a framework for building applications that use LLMs. It provides a set of tools and abstractions for working with LLMs, including a high-level interface for LLMs, a set of chains for working with documents, and a set of agents for working with chat models.

### install langchain
To install langchain we need to headover https://js.langchain.com/v0.2/docs/how_to/installation/. 

```bash
npm install langchain
```
But itsnt the only package we need to install. we need to install the following packages as well:

```bash
npm install @langchain/pinecone
npm install @langchain/community
npm install @langchain/openai
npm install @langchain/core
```

get openai api key from the [openai](https://platform.openai.com/account/api-keys) website and add them to your .env file
save it as OPENAI_API_KEY its 

```env
OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

create a new file called langchain.ts under your lib folder and add the following code: make sure to import the following packages and add them to the top of the file, specify the model used and the index name at the top of the langchain.ts file

```typescript
import { ChatOpenAI } from '@langchain/openai';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'; 
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from '@langchain/openai';
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

if (process.env.OPENAI_API_KEY == null) {
    throw new Error('OPENAI_API_KEY is not set');
}

const model = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo',
    apiKey: process.env.OPENAI_API_KEY,
});

export const indexName = 'pdf-chat';
```

make sure the index name is the same as the one you created in pinecone.
under the following code: create a generateEmbeddingsInPineconeVectorStore function and add the following code:

```typescript   
async function generateEmbeddingsInPineconeVectorStore(docId: string) {
    const {userId} = await auth();  

    if (!userId) {
        throw new Error('User not logged in')
    }   

    ...
}
```

we aren't using auth().protect() because we are using the clerk auth provider and its a server side function.
we could use auth().protect() but we are using the server side function so we will use the auth() function. and extract the userId from the auth() function.

to ensure that the namespace exists we will use the nameSpaceExists function. this function will check if the namespace exists, if it doesn't exist, it will create the namespace. if it does exist, it will just use the existing namespace.

```typescript
async function nameSpaceExists(index: Index<RecordMetadata>, namespace: string) {
    if (namespace == null) throw new Error('Namespace is null');

    const  {namespaces} = await index.describeIndexStats();

    return namespaces?.[namespace] != null;
}

we will use the generateDocs Function to generate the documents. this Function will fetch the pdf file from the storage bucket, split the documents, and then returns the split documents

```typescript
async function generateDocs(docId: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error('User not logged in')
    }

    // fetch the pdf file from the storage bucket
    // we are using firebase admin to fetch the pdf from the storage bucket this is because we don't want to expose the storage key to the client.
    const firebaseRef = await adminDB
        .collection('users')
        .doc(userId)
        .collection('files')
        .doc(docId)
        .get();

    const fileDownloadUrl = await firebaseRef.data()?.url;

    if (!fileDownloadUrl) {
        throw new Error('File not found')
    }

    console.log('Download file from storage bucket successfully: ',fileDownloadUrl);
    
    const response = await fetch(fileDownloadUrl);
    const data = await response.blob();

    console.log('loading pdf file...');
    const loader = new PDFLoader(data);
    const docs = await loader.load();

    console.log('Splitting documents...');
    const splitter = new RecursiveCharacterTextSplitter();

    const splitDocs = await splitter.splitDocuments(docs);
    console.log(`Split ${splitDocs.length} documents`);
    
    return splitDocs;
}
```
