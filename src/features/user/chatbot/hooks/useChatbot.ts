import { useEffect, useRef, useState } from "react";
import { askFAQ } from "../api/chatbot.api";

export type Message = {
  sender: "user" | "bot";
  text: string;
  timestamp: number;
};

export const useChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello 👋! Ask me anything about booking, trips or services.",
      timestamp: Date.now(),
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Smooth scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const question = input.trim();

    // Add user message
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: question, timestamp: Date.now() },
    ]);
    setInput("");
    setIsLoading(true);

    try {
      const { answer } = await askFAQ(question);

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: answer, timestamp: Date.now() },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Something went wrong. Please try again.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return {
    messages,
    input,
    setInput,
    sendMessage,
    handleKeyDown,
    isLoading,
    bottomRef,
  };
};
