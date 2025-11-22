import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X } from "lucide-react";
import { useChatbot } from "../hooks/useChatbot";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, setInput, sendMessage, handleKeyDown, bottomRef, isLoading } =
    useChatbot();
  
  const chatRef = useRef<HTMLDivElement>(null);

  // Close chatbot when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="fixed bottom-4 right-4 z-50" ref={chatRef}>
      {/* FAB Icon */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition cursor-pointer"
        >
          <Bot size={26} />
        </button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 18,
              mass: 0.8,
            }}
            className="
              absolute -bottom-5 -right-5
              
              w-screen h-screen
              max-w-none max-h-none
              rounded-none

              sm:w-[30vw] sm:h-[80vh]
              sm:bottom-0 sm:right-0
              sm:rounded-xl

              bg-white shadow-xl flex flex-col overflow-hidden
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-blue-600 text-white">
              <div className="flex items-center gap-2">
                <Bot size={20} />
                <h1 className="font-semibold text-lg">AI FAQ Assistant</h1>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="cursor-pointer hover:bg-blue-700 p-1 rounded transition"
              >
                <X size={22} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {/* Loading Indicator - Shows while waiting for backend response */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl max-w-[80%] bg-gray-200 text-gray-800 rounded-bl-none">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-gray-600 text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed cursor-text"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center min-w-[80px]"
                >
                  {isLoading ? (
                    <div className="flex items-center cursor-pointer">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Wait
                    </div>
                  ) : (
                    "Send"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}