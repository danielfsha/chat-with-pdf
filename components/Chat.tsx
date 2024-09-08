"use client";

import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useCollection } from "react-firebase-hooks/firestore";
import { useUser } from "@clerk/nextjs";
import {
  collection,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/firebase";
import { Microphone, PaperPlane, Robot, User } from "@phosphor-icons/react";
import { askQuestion } from "@/actions/askQuestion";

export type Message = {
  id: string;
  role: "Human" | "AI" | "Placeholder";
  message: string;
  createdAt: Date;
};

type Props = {
  id: string;
};

function Chat({ id }: Props) {
  const { user } = useUser();

  const [inputMessage, setInputMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();

  const bottomOfChatMessages = useRef<HTMLDivElement>(null);

  const [snapshot, loading, error] = useCollection(
    user && query(
      collection(db, "users", user.id, "files", id, "chat"),
      orderBy("createdAt", "asc")
    ),
  );

  // scroll to bottom of chat messages
  useEffect(() => { 
    if (bottomOfChatMessages.current) {
      bottomOfChatMessages.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages])

  useEffect(() => {
    if (loading || !snapshot) return;

    const newMessages = snapshot.docs.map((doc) => {
      const { role, message, createdAt } = doc.data();
      return {
        id: doc.id,
        role,
        message,
        createdAt: createdAt.toDate(), // Convert Firestore Timestamp to Date
      };
    });

    setMessages(newMessages);
  }, [snapshot, loading]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const q = inputMessage;

    setInputMessage("");
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "Human", message: q, createdAt: new Date() },
      { id: `ai-${Date.now()}`, role: "AI", message: "Thinking..", createdAt: new Date() },
    ]);

    startTransition(async () => {
      const { success, message } = await askQuestion(id, q);

      if (!success) {
        setMessages((prev) => 
          prev.slice(0, prev.length - 1).concat([
            { id: `ai-error-${Date.now()}`, role: "AI", message: message, createdAt: new Date() },
          ])
        );
        return;
      }

      // Optionally, you can add the AI response here if needed
    });
  };

  if (error) {
    return <div>Error loading messages: {error.message}</div>; // Handle error
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* chat messages */}
      <div className="flex-1 flex flex-col overflow-y-auto h-full p-2">
        { 
          messages.map((message, i) => (
            <div key={message.id} className="flex items-center gap-1 p-2">
              <div className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center'>
                {
                  message.role === "Human" && <User className="w-6 h-6" />
                }
                {
                  message.role === "AI" && <Robot className="w-6 h-6" />
                }
              </div>
              
              <div className="flex-1 text-sm">
                <p className="rounded-md px-2 py-1">
                  { message.message }
                </p>
              </div>
            </div>
          ))
        }


        <div ref={ bottomOfChatMessages} />
      </div>

      {/* form */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-center gap-1 p-2"
      >
        <Input
          type="text"
          placeholder="Type your message here..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="focus:outline-none"
        />
        <Button
          size='icon'
          className="w-10 h-10"
          disabled={isPending || inputMessage.length === 0}>
          <PaperPlane className="w-5 h-5 rotate-45" />
        </Button>
      </form>
    </div>
  );
}

export default Chat;
