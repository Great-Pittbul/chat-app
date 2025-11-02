import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "https://chat-app-y0st.onrender.com"; // backend URL
const API_URL = `${SOCKET_URL}/api`;

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [users, setUsers] = useState([]);
  const socketRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      window.location.href = "/";
      return;
    }

    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, { transports: ["websocket"] });

    socketRef.current.emit("join", user.name);

    socketRef.current.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on("userList", (list) => setUsers(list));

    return () => {
      socketRef.current.disconnect();
    };
  }, [user]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (text.trim()) {
      const msg = { text, sender: user.name, time: new Date().toISOString() };
      socketRef.current.emit("message", msg);
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
        display: "flex",
        height: "100vh",
        background: "#111827",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "240px",
          background: "#1f2937",
          padding: "1rem",
          borderRight: "1px solid #374151",
        }}
      >
        <h2 style={{ marginBottom: "1rem", color: "#60a5fa" }}>Chat Users</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {users.map((u, i) => (
            <li key={i} style={{ marginBottom: "0.5rem" }}>
              {u}
            </li>
          ))}
        </ul>
        <button
          onClick={logout}
          style={{
            marginTop: "1rem",
            background: "#ef4444",
            border: "none",
            padding: "10px 15px",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* Chat area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "1rem",
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            marginBottom: "1rem",
            borderRadius: "8px",
            background: "#1f2937",
            padding: "1rem",
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                marginBottom: "0.8rem",
                textAlign: msg.sender === user.name ? "right" : "left",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  background:
                    msg.sender === user.name ? "#2563eb" : "#374151",
                  padding: "8px 12px",
                  borderRadius: "10px",
                }}
              >
                <b>{msg.sender}</b>: {msg.text}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={sendMessage}
          style={{ display: "flex", gap: "8px", alignItems: "center" }}
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #374151",
              background: "#1f2937",
              color: "white",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 15px",
              background: "#2563eb",
              border: "none",
              borderRadius: "6px",
              color: "white",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
