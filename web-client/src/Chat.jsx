// ✅ CHAT.JSX — ONLY AVATAR UPDATED (A2 PREMIUM STATIC HALO)

import React, { useState, useEffect, useRef } from "react";
import { Send, Loader, User, Bot } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Chat() {
  const navigate = useNavigate();
  const stored = JSON.parse(localStorage.getItem("user") || "{}");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm KUMBO. How can I help you evolve today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const reply = {
        role: "assistant",
        content:
          "I'm processing your request. This is a simulated response for now.",
      };
      setMessages((m) => [...m, reply]);
      setLoading(false);
    }, 900);
  };

  const Avatar = ({ role }) => {
    const isUser = role === "user";

    return (
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* ✅ STATIC PREMIUM HALO */}
        <div
          style={{
            position: "absolute",
            width: "62px",
            height: "62px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at center, rgba(255,215,0,0.35), rgba(0,0,0,0))",
            filter: "blur(8px)",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            border: "2px solid rgba(255,205,70,0.8)",
            boxShadow:
              "0 0 12px rgba(255,215,0,0.35), inset 0 0 6px rgba(255,215,0,0.35)",
            zIndex: 1,
          }}
        />

        {/* ✅ ICON */}
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: isUser
              ? "linear-gradient(135deg, #1c1f2b, #131620)"
              : "linear-gradient(135deg, #1c2833, #0f131a)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 2,
            border: "1px solid rgba(255,215,0,0.5)",
            boxShadow:
              "0 0 6px rgba(255,215,0,0.25), inset 0 0 4px rgba(255,215,0,0.25)",
          }}
        >
          {isUser ? (
            <User size={18} color="#fff" />
          ) : (
            <Bot size={18} color="#fff" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-header">
        <div className="kumbo-logo-min">KUMBO</div>
        <button
          className="settings-btn"
          onClick={() => navigate("/settings")}
        >
          ⚙
        </button>
      </div>

      <div className="chat-body">
        {messages.map((m, i) => (
          <div key={i} className={`chat-line ${m.role}`}>
            <Avatar role={m.role} />
            <motion.div
              className="chat-bubble"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {m.content}
            </motion.div>
          </div>
        ))}

        {loading && (
          <div className="chat-line assistant">
            <Avatar role="assistant" />
            <div className="chat-bubble typing">
              <Loader className="spin" size={16} /> ...
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      <div className="chat-input-area">
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message KUMBO..."
        />
        <button className="send-btn" onClick={sendMessage}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
