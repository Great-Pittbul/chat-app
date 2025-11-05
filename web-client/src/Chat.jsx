import React, { useEffect, useState, useRef } from "react";
import { FiSend, FiSettings, FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

const API_URL = "https://chat-app-y0st.onrender.com";

export default function Chat() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const socket = useRef(null);
  const bottom = useRef(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.current = io(API_URL, {
      auth: { token },
    });

    socket.current.on("history", (data) => setMessages(data));
    socket.current.on("message", (msg) =>
      setMessages((prev) => [...prev, msg])
    );

    return () => socket.current.disconnect();
  }, []);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send() {
    if (!input.trim()) return;
    socket.current.emit("send_message", { body: input });
    setInput("");
  }

  function logout() {
    localStorage.clear();
    window.location.href = "/";
  }

  return (
    <div className="chat-body">
      <header className="chat-header">
        <h2>KUMBO</h2>

        <div className="head-icons">
          <Link to="/settings">
            <FiSettings />
          </Link>
          <FiLogOut onClick={logout} />
        </div>
      </header>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`msg ${
              msg.user === user.name ? "my-msg" : "their-msg"
            }`}
          >
            <p>{msg.body}</p>
            <span>{msg.user}</span>
          </div>
        ))}

        <div ref={bottom}></div>
      </div>

      <div className="chat-input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Message…"
        />
        <button onClick={send}>
          <FiSend />
        </button>
      </div>
    </div>
  );
}
