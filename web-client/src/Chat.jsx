import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Menu } from "lucide-react";
import clsx from "clsx";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { from: "me", text: input }]);
    setInput("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full h-screen bg-[#0A0A0A] text-white flex flex-col relative overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="p-4 flex items-center justify-between bg-[#0F0F0F]/60 backdrop-blur-xl border-b border-white/5"
      >
        <div className="flex items-center gap-3">
          <ArrowLeft className="w-5 h-5 text-white/80" />
          <span className="font-semibold text-lg tracking-wide text-white">Kumbo Chat</span>
        </div>
        <Menu className="w-6 h-6 text-white/70" />
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={clsx(
              "max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-lg", {
                "ml-auto bg-gradient-to-br from-yellow-500/20 to-yellow-700/20 border border-yellow-500/10 text-white":
                  msg.from === "me",
                "bg-white/5 border border-white/10 text-white/90": msg.from !== "me",
              }
            )}
          >
            {msg.text}
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-[#0F0F0F]/60 backdrop-blur-xl border-t border-white/5 flex items-center gap-3"
      >
        <input
          className="flex-1 bg-white/5 border border-white/10 text-white placeholder-white/40 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-yellow-500/40"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="p-3 bg-gradient-to-br from-yellow-400/30 to-yellow-600/30 border border-yellow-500/20 rounded-xl hover:opacity-80 transition"
        >
          <Send className="w-5 h-5 text-yellow-300" />
        </button>
      </motion.div>
    </div>
  );
}
