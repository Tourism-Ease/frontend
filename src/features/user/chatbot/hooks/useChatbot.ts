// src/hooks/useChatbot.ts
import { useState, useRef, useEffect } from "react";
import { sendMessageToBot } from "../api/chatbot.api";

export type Message = {
  sender: "user" | "bot";
  text: string;
  timestamp?: number;
};

export const useChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Log environment info on component mount
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    console.log('Chatbot mounted - Environment check:');
    console.log('REACT_APP_GEMINI_API_KEY exists:', !!apiKey);
    console.log('NODE_ENV:', import.meta.env.NODE_ENV);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "nearest"
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { 
      sender: "user", 
      text: input.trim(),
      timestamp: Date.now()
    };
    
    setError(null);
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      console.log('Sending message to API...');
      const botReply = await sendMessageToBot(input.trim());
      console.log('Received reply from API');
      
      const botMessage: Message = { 
        sender: "bot", 
        text: botReply,
        timestamp: Date.now()
      };
      setMessages((prev) => [...prev, botMessage]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Chat error details:', err);
      setError(err.message);
      
      const errorMessage: Message = {
        sender: "bot",
        text: err.message || "I'm having trouble responding right now. Please check your API configuration.",
        timestamp: Date.now()
      };
      setMessages((prev) => [...prev, errorMessage]);
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

  const clearMessages = () => {
    setMessages([{
      sender: "bot",
      text: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: Date.now()
    }]);
    setError(null);
  };

  return {
    messages,
    input,
    setInput,
    bottomRef,
    sendMessage,
    handleKeyDown,
    isLoading,
    error,
    clearMessages,
  };
};