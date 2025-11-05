import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { Sun, Moon, Settings, X } from "lucide-react";

const API_URL = "https://chat-app-y0st.onrender.com";

export default function Chat() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [showSettings, setShowSettings] = useState(false);
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);

  // Connect socket
  useEffect(() => {
    socketRef.current = io(API_URL, {
      auth: { token: user.token },
    });

    socketRef.current.on("history", (msgs) => setMessages(msgs));
    socketRef.current.on("message", (msg) => setMessages((prev) => [...prev, msg]));

    return () => socketRef.current.disconnect();
  }, [user.token]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Toggle theme
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

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
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
            onClick={() => setShowSettings(true)}
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

      {/* Settings Modal */}
      {showSettings && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
          onClick={() => setShowSettings(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: dark ? "#1e293b" : "white",
              padding: "2rem",
              borderRadius: "12px",
              width: "300px",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowSettings(false)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: dark ? "#fca5a5" : "#ef4444",
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ marginBottom: "1rem" }}>Settings</h3>

            <button
              onClick={() => setDark(!dark)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "1rem",
                background: dark ? "#2563eb" : "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
            >
              Toggle {dark ? "Light" : "Dark"} Mode
            </button>

            <button
              onClick={logout}
              style={{
                width: "100%",
                padding: "10px",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "0.3s",
                fontWeight: "bold",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#b91c1c")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#ef4444")}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
