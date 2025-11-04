import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Settings, X, LogOut, SendHorizonal } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "https://chat-app-y0st.onrender.com";

export default function Chat() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [showSettings, setShowSettings] = useState(false);

  const socketRef = useRef(null);
  const chatEndRef = useRef(null);

  // ✅ SOCKET CONNECTION
  useEffect(() => {
    socketRef.current = io(API_URL, {
      auth: { token: user.token },
    });

    socketRef.current.on("history", (msgs) => setMessages(msgs));
    socketRef.current.on("message", (msg) => setMessages((prev) => [...prev, msg]));

    return () => socketRef.current.disconnect();
  }, [user.token]);

  // ✅ AUTO SCROLL
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ THEME SYNC
  useEffect(() => {
    document.body.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

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

      {/* ✅ TOP BAR */}
      <motion.div
        className="chat-top-bar glass-panel"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="chat-title">KUMBO</div>

        <div className="chat-actions">
          <button
            className="icon-btn"
            onClick={() => setDark(!dark)}
            title="Toggle Theme"
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            className="icon-btn"
            onClick={() => setShowSettings(true)}
          >
            <Settings size={21} />
          </button>
        </div>
      </motion.div>

      {/* ✅ MESSAGES AREA */}
      <div className="chat-body">
        <AnimatePresence>
          {messages.map((msg, i) => {
            const isMine = msg.user === user.name;

            return (
              <motion.div
                key={i}
                className={`message-bubble ${isMine ? "mine" : "theirs"}`}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {!isMine && <div className="msg-user">{msg.user}</div>}

                <div className="msg-text">{msg.body}</div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        <div ref={chatEndRef} />
      </div>

      {/* ✅ INPUT BAR */}
      <motion.div
        className="chat-input-bar glass-panel"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
      >
        <input
          className="chat-input"
          value={text}
          placeholder="Write something..."
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button className="send-btn" onClick={sendMessage}>
          <SendHorizonal size={20} />
        </button>
      </motion.div>

      {/* ✅ SETTINGS MODAL */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="settings-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="settings-box glass-panel"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35 }}
            >
              <button className="close-settings" onClick={() => setShowSettings(false)}>
                <X size={22} />
              </button>

              <h2 className="settings-title">Settings</h2>

              <button
                className="luxury-btn"
                onClick={() => setDark(!dark)}
                style={{ marginBottom: 18 }}
              >
                Toggle {dark ? "Light" : "Dark"} Mode
              </button>

              <button
                className="logout-btn"
                onClick={logout}
              >
                <LogOut size={18} />
                Logout
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
