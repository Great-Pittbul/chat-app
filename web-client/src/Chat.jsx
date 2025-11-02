import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const BACKEND_URL = "https://chat-app-2-9qbx.onrender.com"; // backend URL

export default function Chat() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/";
      return;
    }

    const newSocket = io(BACKEND_URL, { auth: { token } });
    setSocket(newSocket);

    newSocket.on("connect", () => console.log("Connected to chat"));
    newSocket.on("history", (msgs) => setMessages(msgs));
    newSocket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => newSocket.disconnect();
  }, [token]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit("send_message", { body: message });
    setMessage("");
  };

  return (
    <div style={styles.container}>
      <h2 style={{ color: "#fff" }}>Chat Room</h2>
      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div key={i} style={styles.msg}>
            <strong>{msg.user}:</strong> {msg.body}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={styles.form}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button style={styles.button}>Send</button>
      </form>
      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/";
        }}
        style={styles.logout}
      >
        Logout
      </button>
    </div>
  );
}

const styles = {
  container: {
    background: "#0d1117",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
  },
  chatBox: {
    background: "#161b22",
    borderRadius: "10px",
    padding: "10px",
    width: "80%",
    height: "400px",
    overflowY: "auto",
    marginBottom: "10px",
    color: "#fff",
  },
  msg: {
    padding: "5px 0",
  },
  form: {
    display: "flex",
    gap: "10px",
    width: "80%",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #30363d",
    background: "#0d1117",
    color: "#fff",
  },
  button: {
    background: "#238636",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    color: "#fff",
    cursor: "pointer",
  },
  logout: {
    background: "red",
    color: "#fff",
    border: "none",
    padding: "8px 15px",
    marginTop: "15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
