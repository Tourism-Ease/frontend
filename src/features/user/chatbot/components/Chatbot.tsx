import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X } from "lucide-react";
import { useChatbot } from "../hooks/useChatbot";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, setInput, sendMessage, handleKeyDown, bottomRef } =
    useChatbot();

  return (
    <div className="fixed bottom-4 right-4 z-50">

      {/* FAB Icon */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition"
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
              <button onClick={() => setIsOpen(false)}>
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
                  className="flex-1 px-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-400"
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
