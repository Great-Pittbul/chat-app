import React, { useState, useEffect, useRef } from "react";
import { FiSettings, FiLogOut, FiSend } from "react-icons/fi";
import { Link } from "react-router-dom";

const API_URL = "https://chat-app-y0st.onrender.com";

// ✅ Safe JSON parser (prevents crash)
function safeParseUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch (e) {
    console.warn("Invalid user JSON reset:", e);
    localStorage.removeItem("user");
    return null;
  }
}

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  // ✅ SAFE USER LOAD
  const user = safeParseUser();

  const bottomRef = useRef(null);

  // ✅ Scroll to bottom
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ✅ Load chat history
  useEffect(() => {
    async function loadMessages() {
      try {
        const res = await fetch(`${API_URL}/messages`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    }
    loadMessages();
  }, []);

  // ✅ Send message
  async function sendMessage() {
    if (!input.trim()) return;

    const newMsg = {
      text: input,
      sender: user?.name || "Unknown User",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setTyping(true);

    try {
      await fetch(`${API_URL}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMsg),
      });
    } catch (err) {
      console.error("Send error:", err);
    }

    setTimeout(() => setTyping(false), 800);
  }

  // ✅ Enter key send
  function handleKey(e) {
    if (e.key === "Enter") sendMessage();
  }

  // ✅ Logout safely
  function logout() {
    localStorage.removeItem("user");
    window.location.href = "/";
  }

  return (
    <div className="chat-container">
      {/* ✅ Top bar */}
      <header className="chat-header">
        <h2 className="app-title">KUMBO</h2>

        <div className="header-actions">
          <Link to="/settings" className="settings-btn">
            <FiSettings />
          </Link>
          <button onClick={logout} className="logout-btn">
            <FiLogOut />
          </button>
        </div>
      </header>

      {/* ✅ Messages */}
      <div className="messages-area">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.sender === user?.name ? "my-msg" : "other-msg"}`}
          >
            <p className="msg-text">{msg.text}</p>
            <span className="msg-time">{msg.time}</span>
          </div>
        ))}

        {typing && <div className="typing">Typing...</div>}

        <div ref={bottomRef}></div>
      </div>

      {/* ✅ Input box */}
      <div className="input-area">
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
        />
        <button className="send-btn" onClick={sendMessage}>
          <FiSend />
        </button>
      </div>
    </div>
  );
}
