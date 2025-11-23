// src/features/chatbot/hooks/useChatbot.ts
import http from "@/lib/axios";
import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  text: string;
  sender: "user" | "bot";
}

export function useChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm your AI FAQ assistant. How can I help you today?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    // Add user message immediately
    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);

    try {
      const { data } = await http.post("/chatbot", { message: userMessage });

      // Add bot response from backend
      setMessages((prev) => [
        ...prev,
        {
          text:
            data.response ||
            data.answer ||
            data.message ||
            "I've received your message.",
          sender: "bot",
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);

      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  return {
    messages,
    input,
    setInput,
    sendMessage,
    handleKeyDown,
    bottomRef,
    isLoading,
  };
}
