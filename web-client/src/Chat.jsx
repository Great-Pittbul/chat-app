import React, { useState, useEffect, useRef } from "react";
import { FiSend, FiSettings, FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";

const API_URL = "https://chat-app-y0st.onrender.com";

function safeParseUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const user = safeParseUser();

  useEffect(() => {
    fetch(`${API_URL}/messages`)
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const msg = {
      text: input,
      sender: user?.name,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, msg]);
    setInput("");

    await fetch(`${API_URL}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msg),
    });
  }

  return (
    <div className="chat-bg">
      <header className="chat-header">
        <h2 className="chat-title">KUMBO</h2>

        <div className="chat-header-actions">
          <Link to="/settings" className="icon-btn">
            <FiSettings />
          </Link>

          <button
            className="icon-btn"
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
          >
            <FiLogOut />
          </button>
        </div>
      </header>

      <div className="chat-body">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`chat-bubble ${m.sender === user?.name ? "mine" : "theirs"}`}
          >
            <p>{m.text}</p>
            <span>{m.time}</span>
          </div>
        ))}

        <div ref={bottomRef}></div>
      </div>

      <div className="chat-input-area">
        <input
          className="chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="send-btn" onClick={sendMessage}>
          <FiSend />
        </button>
      </div>
    </div>
  );
}
