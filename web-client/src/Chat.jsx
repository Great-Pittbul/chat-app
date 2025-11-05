import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import KumboLogo from "./components/KumboLogo";

const API_URL = "https://chat-app-y0st.onrender.com";

function safeUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export default function Chat() {
  const user = safeUser();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetch(`${API_URL}/messages`)
      .then((r) => r.json())
      .then((d) => setMessages(d));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const msg = {
      text: input,
      sender: user?.name,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((m) => [...m, msg]);
    setInput("");

    await fetch(`${API_URL}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msg)
    });
  }

  return (
    <div className="chat-bg">
      <header className="chat-header glass">
        <KumboLogo size={40} />
        <h2 className="chat-title">KUMBO CHAT</h2>

        <div className="chat-actions">
          <Link to="/settings" className="icon-btn">⚙️</Link>
          <button className="icon-btn" onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/";
          }}>⏻</button>
        </div>
      </header>

      <div className="messages-area">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              msg.sender === user?.name ? "msg msg-me" : "msg msg-other"
            }
          >
            <p className="msg-text">{msg.text}</p>
            <span className="msg-time">{msg.time}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="input-area glass">
        <input
          className="chat-input"
          placeholder="Type message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button className="send-btn" onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
}
