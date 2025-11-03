import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { Sun, Moon, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://chat-app-y0st.onrender.com";

export default function Chat() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    socketRef.current = io(API_URL, {
      auth: { token: user.token },
    });

    socketRef.current.on("history", (msgs) => setMessages(msgs));
    socketRef.current.on("message", (msg) => setMessages((prev) => [...prev, msg]));

    return () => socketRef.current.disconnect();
  }, [user.token]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    document.body.style.background = dark ? "#0f172a" : "#f8fafc";
    document.body.style.color = dark ? "white" : "black";
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const sendMessage = () => {
    if (text.trim()) {
      socketRef.current.emit("send_message", { body: text });
      setText("");
    }
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: dark ? "#1e293b" : "white",
        boxShadow: dark ? "0 0 10px rgba(255,255,255,0.1)" : "0 0 10px rgba(0,0,0,0.1)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
          background: dark ? "#0f172a" : "#f1f5f9",
          borderBottom: dark ? "1px solid #334155" : "1px solid #e2e8f0",
        }}
      >
        <h2>{user?.name}'s Chat</h2>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button
            onClick={() => setDark(!dark)}
            title="Toggle Theme"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: dark ? "#facc15" : "#334155",
              transition: "0.3s",
            }}
          >
            {dark ? <Sun size={22} /> : <Moon size={22} />}
          </button>

          <button
            onClick={() => navigate("/settings")}
            title="Settings"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: dark ? "#93c5fd" : "#334155",
              transition: "0.3s",
            }}
          >
            <Settings size={22} />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem",
          background: dark ? "#1e293b" : "#f8fafc",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              background:
                msg.user === user.name
                  ? dark
                    ? "#2563eb"
                    : "#3b82f6"
                  : dark
                  ? "#334155"
                  : "#e2e8f0",
              color: "white",
              padding: "8px 12px",
              borderRadius: "10px",
              margin: "8px 0",
              alignSelf: msg.user === user.name ? "flex-end" : "flex-start",
              maxWidth: "80%",
            }}
          >
            <strong>{msg.user}</strong>
            <p style={{ margin: "5px 0 0", fontSize: "0.95rem" }}>{msg.body}</p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div
        style={{
          display: "flex",
          padding: "1rem",
          background: dark ? "#0f172a" : "#f1f5f9",
          borderTop: dark ? "1px solid #334155" : "1px solid #e2e8f0",
        }}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #64748b",
            outline: "none",
            background: dark ? "#1e293b" : "white",
            color: dark ? "white" : "black",
            marginRight: "0.5rem",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
        >
          Send
        </button>
      </div>
    </div>
  );
}
