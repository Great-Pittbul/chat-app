import React, { useState, useEffect } from "react";
import { Send, Settings as SettingsIcon, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function Chat() {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const sendMessage = () => {
    if (!input.trim()) return;

    setMsgs((prev) => [...prev, { from: "user", text: input }]);

    setTimeout(() => {
      setMsgs((prev) => [...prev, { from: "bot", text: "…" }]);
    }, 500);

    setInput("");
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="chat-container">
      <motion.div
        className="chat-header"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <span className="gold">KUMBO</span>

        <div style={{ position: "absolute", right: 18, top: 18, display: "flex", gap: 14 }}>
          <a href="/settings">
            <SettingsIcon color="var(--gold)" size={22} />
          </a>

          <LogOut
            color="var(--gold)"
            size={22}
            onClick={logout}
            style={{ cursor: "pointer" }}
          />
        </div>
      </motion.div>

      <div className="chat-area">
        {msgs.map((m, i) => (
          <motion.div
            key={i}
            className={`message ${m.from}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {m.text}
          </motion.div>
        ))}
      </div>

      <div className="chat-input-area">
        <input
          placeholder="Type message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button onClick={sendMessage}>
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
