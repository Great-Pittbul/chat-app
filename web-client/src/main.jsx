import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { io } from "socket.io-client";
import Auth from "./Auth";

const API = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socket = token ? io(API, { auth: { token } }) : null;

  useEffect(() => {
    if (!socket) return;
    socket.on("message", (msg) => setMessages((p) => [...p, msg]));
    return () => socket.disconnect();
  }, [token]);

  const send = () => {
    if (!text.trim()) return;
    socket.emit("send_message", { body: text });
    setText("");
  };

  if (!token)
    return <Auth setToken={setToken} setUser={setUser} />;

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>💬 Realtime Chat</h2>
      <p>Logged in as <b>{user}</b></p>
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
          <div key={i}>
            <b>{m.user}:</b> {m.body}
          </div>
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
