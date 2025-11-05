import React, { useState, useEffect, useRef } from "react";
import { FiSettings, FiLogOut, FiSend } from "react-icons/fi";
import { Link } from "react-router-dom";

const API_URL = "https://chat-app-y0st.onrender.com";

function safeParseUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export default function Chat() {
  const user = safeParseUser();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/messages`);
        const data = await res.json();
        setMessages(data);
      } catch {}
    }
    load();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const newMsg = {
      text: input,
      sender: user?.name || "User",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    try {
      await fetch(`${API_URL}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMsg),
      });
    } catch {}
  }

  return (
    <div className="chat-page">

      <header className="chat-header">
        <h2>KUMBO</h2>
        <div className="header-controls">
          <Link to="/settings" className="icon-btn"><FiSettings /></Link>
          <button className="icon-btn" onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/";
          }}>
            <FiLogOut />
          </button>
        </div>
      </header>

      <div className="messages-box">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`msg ${msg.sender === user?.name ? "my" : "other"}`}
          >
            <p>{msg.text}</p>
            <span>{msg.time}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="input-bar">
        <input
          type="text"
          placeholder="Type message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}><FiSend /></button>
      </div>
    </div>
  );
}
