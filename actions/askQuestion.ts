'use server'

import { Message } from "@/components/Chat";
import { adminDB } from "@/firebaseAdmin";
import { generateLangchainChatCompletion } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server";

export const askQuestion = async (docId: string, question: string) => {
    auth().protect();

    const { userId } = await auth();

    if (!userId) return { success: false, message: 'You need to be logged in to ask a question' };

    const ref = await adminDB.collection("users").doc(userId).collection("files").doc(docId).collection("chat")
     
    const userMessage: Message = {
        id: Date.now().toString(),
        role: "Human",
        message: question,
        createdAt: new Date(),
    };

    try {
        await ref.add(userMessage);
        const reply = await generateLangchainChatCompletion(docId, question);

        await ref.add({
            id: Date.now().toString(),
            role: "AI",
            message: reply,
            createdAt: new Date(),
        });


        return { success: true, message: 'Question asked successfully' };
    } catch (error) {
        return { success: false, message: "whoops something went wrong" };
    }
}