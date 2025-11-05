import React, { useState, useEffect } from "react";
import { LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL || "https://your-socket-server.com");

export default function Chat() {
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    document.body.style.background = dark ? "#0f172a" : "#f8fafc";
    document.body.style.color = dark ? "white" : "black";
  }, [dark]);

  useEffect(() => {
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => socket.off("message");
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    const msgData = { user: user?.username || "Guest", text: message };
    socket.emit("message", msgData);
    setMessages((prev) => [...prev, msgData]);
    setMessage("");
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: dark ? "#0f172a" : "#f1f5f9",
        transition: "0.3s",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 1.5rem",
          background: dark ? "#1e293b" : "#ffffff",
          borderBottom: dark ? "1px solid #334155" : "1px solid #e2e8f0",
          boxShadow: dark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ fontSize: "1.3rem", fontWeight: "bold" }}>💬 UCEM Chat</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => navigate("/settings")}
            style={{
              background: dark ? "#2563eb" : "#3b82f6",
              border: "none",
              color: "white",
              padding: "8px 12px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              transition: "0.3s",
              fontWeight: "bold",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = dark ? "#2563eb" : "#3b82f6")}
          >
            <Settings size={18} />
            Settings
          </button>

          <button
            onClick={logout}
            style={{
              background: "#ef4444",
              border: "none",
              color: "white",
              padding: "8px 12px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              transition: "0.3s",
              fontWeight: "bold",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#b91c1c")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#ef4444")}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          padding: "1rem",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              alignSelf: msg.user === user?.username ? "flex-end" : "flex-start",
              background: msg.user === user?.username ? "#3b82f6" : dark ? "#334155" : "#e2e8f0",
              color: msg.user === user?.username ? "white" : dark ? "#f1f5f9" : "black",
              padding: "10px 14px",
              borderRadius: "12px",
              maxWidth: "70%",
              boxShadow: dark
                ? "0 2px 6px rgba(255,255,255,0.1)"
                : "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <strong>{msg.user}</strong>
            <p style={{ margin: "4px 0 0" }}>{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Input */}
      <div
        style={{
          padding: "1rem",
          borderTop: dark ? "1px solid #334155" : "1px solid #e2e8f0",
          display: "flex",
          gap: "10px",
          background: dark ? "#1e293b" : "#ffffff",
        }}
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            outline: "none",
            background: dark ? "#334155" : "#f1f5f9",
            color: dark ? "white" : "black",
            transition: "0.3s",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "12px 20px",
            background: "#22c55e",
            border: "none",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#15803d")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#22c55e")}
        >
          Send
        </button>
      </div>
    </div>
  );
}
