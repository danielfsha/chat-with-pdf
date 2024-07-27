'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

import { generateEmbeddingsInPineconeVectorStore } from '@/lib/langchain'

async function generateEmbeddings(
    docId: string,
) {
    auth().protect()
    
    await generateEmbeddingsInPineconeVectorStore(docId) 

    revalidatePath('/dashboard')

    return {
        completed: true,
    }
}

export default generateEmbeddings