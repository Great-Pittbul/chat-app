import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const socket = io("https://chat-app-y0st.onrender.com", {
    auth: { token: user?.token },
  });

  useEffect(() => {
    socket.on("connect", () => console.log("Connected to chat"));
    socket.on("history", (msgs) => setMessages(msgs));
    socket.on("message", (msg) => setMessages((prev) => [...prev, msg]));

    return () => socket.disconnect();
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    socket.emit("send_message", { body });
    setBody("");
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>💬 Chat Room</h3>
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className="chat-message">
            <strong>{msg.user}</strong>
            <p>{msg.body}</p>
          </div>
        ))}
      </div>

      <form className="chat-input-container" onSubmit={sendMessage}>
        <input
          type="text"
          className="chat-input"
          placeholder="Type your message..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button type="submit" className="chat-send">
          Send
        </button>
      </form>
    </div>
  );
}
