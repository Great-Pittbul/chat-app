import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { motion } from "framer-motion";
import { LogOut, Send, Settings } from "lucide-react";

const API_URL = "https://chat-app-y0st.onrender.com";

export default function Chat() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  // Connect to socket
  useEffect(() => {
    socketRef.current = io(API_URL, { auth: { token: user.token } });

    socketRef.current.on("history", (msgs) => setMessages(msgs));
    socketRef.current.on("message", (msg) =>
      setMessages((prev) => [...prev, msg])
    );

    return () => socketRef.current.disconnect();
  }, [user.token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;

    socketRef.current.emit("send_message", { body: text });
    setText("");
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="chat-wrapper">

      {/* Header */}
      <motion.div
        className="chat-header"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="chat-title">
          <h2>KUMBO</h2>
          <p className="subtitle">{user?.name}</p>
        </div>

        <div className="chat-actions">
          <button className="icon-btn" onClick={() => setShowSettings(true)}>
            <Settings size={20} />
          </button>

          <button className="icon-btn logout" onClick={logout}>
            <LogOut size={20} />
          </button>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="chat-body">
        {messages.map((msg, i) => {
          const mine = msg.user === user.name;
          return (
            <motion.div
              key={i}
              className={`chat-bubble ${mine ? "mine" : ""}`}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25 }}
            >
              {!mine && <strong className="bubble-user">{msg.user}</strong>}
              <p className="bubble-text">{msg.body}</p>
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="chat-input"
          placeholder="Type your message..."
        />

        <motion.button
          className="send-btn"
          onClick={sendMessage}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
        >
          <Send size={18} />
        </motion.button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <motion.div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <h3 className="modal-title">Settings</h3>
            <p className="modal-item">More settings coming soon…</p>

            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
