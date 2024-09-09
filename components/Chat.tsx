"use client";

import ReactMarkdown from 'react-markdown'

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


import {
  LiveConnectionState,
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
  useDeepgram,
} from "@/context/DeepgramContextProvider";
import {
  MicrophoneEvents,
  MicrophoneState,
  useMicrophone,
} from "@/context/MicrophoneContextProvider";

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

  const [pageHasLoaded, setPageHasLoaded] = useState(false);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();

  const bottomOfChatMessages = useRef<HTMLDivElement>(null);

  const { connection, connectToDeepgram, connectionState } = useDeepgram();
  const { setupMicrophone, microphone, startMicrophone, microphoneState } =
    useMicrophone();
  const captionTimeout = useRef<any>();
  const keepAliveInterval = useRef<any>();

  useEffect(() => {
    setupMicrophone();
    setPageHasLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (microphoneState === MicrophoneState.Ready) {
      connectToDeepgram({
        model: "nova-2",
        interim_results: true,
        smart_format: true,
        filler_words: true,
        utterance_end_ms: 3000,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphoneState]);

  useEffect(() => {
    if (!microphone) return;
    if (!connection) return;

    const onData = (e: BlobEvent) => {
      // iOS SAFARI FIX:
      // Prevent packetZero from being sent. If sent at size 0, the connection will close. 
      if (e.data.size > 0) {
        connection?.send(e.data);
      }
    };

    const onTranscript = (data: LiveTranscriptionEvent) => {
      const { is_final: isFinal, speech_final: speechFinal } = data;
      let thisCaption = data.channel.alternatives[0].transcript;

      console.log("thisCaption", thisCaption);
      if (thisCaption !== "") {
        setInputMessage(thisCaption);
      }
    };

    if (connectionState === LiveConnectionState.OPEN) {
      connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.addEventListener(MicrophoneEvents.DataAvailable, onData);

      startMicrophone();
    }

    return () => {
      // prettier-ignore
      connection.removeListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.removeEventListener(MicrophoneEvents.DataAvailable, onData);
      clearTimeout(captionTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionState]);

  useEffect(() => {
    if (!connection) return;

    if (
      microphoneState !== MicrophoneState.Open &&
      connectionState === LiveConnectionState.OPEN
    ) {
      connection.keepAlive();

      keepAliveInterval.current = setInterval(() => {
        connection.keepAlive();
      }, 10000);
    } else {
      clearInterval(keepAliveInterval.current);
    }

    return () => {
      clearInterval(keepAliveInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphoneState, connectionState]);

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

  useEffect(() => {
    const TTSLastReply = async () => {
      if (!pageHasLoaded) return;

      if (!snapshot) return;

      const messages = snapshot?.docs.map((doc) => {
        const { role, message, createdAt } = doc.data();
        return {
          id: doc.id,
          role,
          message,
          createdAt: createdAt.toDate(), // Convert Firestore Timestamp to Date
        };
      });
      const lastReply = messages[messages.length - 1];
      if (lastReply.role === "AI") {
        console.log("lastReply message: ", lastReply.message);
      }
    };

    TTSLastReply();
  }, [snapshot])

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
            <div key={message.id} className={`chat ${message.role == "Human" ? "chat-end" : "chat-start"}`}>               
              <p className={`chat chat-bubble ${message.role == 'AI' && '!bg-gray-200 !text-black'}`}>
                {/* the actual content is inside the message */}
                <ReactMarkdown>message.message</ReactMarkdown>
              </p>

              {
                message.role === "Human" && <img 
                  src={user?.imageUrl}
                  width={40}
                  height={40}
                  alt="User Avatar"
                  className="rounded-full"
                />
              }
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
