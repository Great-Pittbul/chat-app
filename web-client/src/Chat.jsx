import React, { useState, useEffect, useRef } from "react";
import { Send, Settings as SettingsIcon, LogOut } from "lucide-react";
import "./style.css";

export default function Chat() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const chatEndRef = useRef(null);

  const handleSend = () => {
    if (!draft.trim()) return;
    const newMsg = { sender: "me", text: draft };
    setMessages([...messages, newMsg]);
    setDraft("");
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const goToSettings = () => {
    window.location.href = "/settings";
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-wrapper">

      {/* Header */}
      <div className="chat-header">
        <h1 className="chat-logo">KUMBO</h1>

        <div className="chat-header-actions">
          <SettingsIcon className="icon-btn" onClick={goToSettings} />
          <LogOut className="icon-btn" onClick={logout} />
        </div>
      </div>

      {/* Premium Full-Width Card */}
      <div className="chat-card">

        <div className="messages-area">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === "me" ? "my-msg" : "ai-msg"}`}
            >
              {msg.text}
            </div>
          ))}

          <div ref={chatEndRef}></div>
        </div>

        {/* Message Input */}
        <div className="msg-box">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a message..."
            className="msg-input"
          />

          <button onClick={handleSend} className="send-btn">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
