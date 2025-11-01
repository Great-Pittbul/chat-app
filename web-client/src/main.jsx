import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:3000");

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    socket.on("message", (msg) => setMessages((prev) => [...prev, msg]));
    return () => socket.off("message");
  }, []);

  const send = () => {
    if (!text.trim()) return;
    socket.emit("send_message", {
      body: text,
      created_at: new Date().toISOString(),
    });
    setText("");
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>💬 Realtime Chat</h2>
      <div
        style={{
          border: "1px solid #ccc",
          height: 300,
          overflowY: "auto",
          marginBottom: 10,
          padding: 10,
        }}
      >
        {messages.map((m, i) => (
          <div key={i}>{m.body}</div>
        ))}
      </div>
      <input
        style={{ width: "70%" }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
        placeholder="Type message..."
      />
      <button onClick={send}>Send</button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
