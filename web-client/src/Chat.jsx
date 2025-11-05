import React, { useEffect, useState, useRef } from "react";
import { Sun, Moon, Settings, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const API_URL = "https://chat-app-y0st.onrender.com";

export default function Chat() {
  const navigate = useNavigate();
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");
  const socketRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    // apply light-first theme
    if (!localStorage.getItem("theme")) localStorage.setItem("theme", "light");
    document.body.setAttribute("data-theme", localStorage.getItem("theme") || "light");
  }, []);

  useEffect(() => {
    document.body.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    if (!user?.token) {
      navigate("/");
      return;
    }

    socketRef.current = io(API_URL, { auth: { token: user.token } });

    socketRef.current.on("history", (msgs) => setMessages(msgs || []));
    socketRef.current.on("message", (m) => setMessages((prev) => [...prev, m]));

    return () => socketRef.current?.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    if (e) e.preventDefault();
    if (!text.trim() || !socketRef.current) return;
    socketRef.current.emit("send_message", { body: text });
    setText("");
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const avatarFor = (name = "") => {
    return (name || "U").split(" ").map(s => s[0]).slice(0,2).join("").toUpperCase();
  };

  return (
    <div className="chat-shell" style={{ minHeight: "80vh" }}>
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        {/* header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 18,
          background: "linear-gradient(90deg,#eef7ff, #f8f8ff)",
          borderBottom: "1px solid rgba(16,24,40,0.04)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="kumbo-logo" style={{ fontSize: 20 }}>KUMBO</div>
            <div style={{ color: "rgba(11,18,32,0.6)" , fontWeight: 600}}>Chat</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 10
              }}>
                <div style={{ textAlign: "right", marginRight: 8 }}>
                  <div style={{ fontWeight: 700 }}>{user?.name}</div>
                  <div style={{ fontSize: 12, opacity: 0.6 }}>{user?.email}</div>
                </div>
                <div style={{
                  width: 44, height: 44, borderRadius: 999, display: "grid", placeItems: "center",
                  background: "linear-gradient(90deg,#06b6d4,#ffd166)", color: "#042b2a", fontWeight: 800
                }}>
                  {avatarFor(user?.name)}
                </div>
              </div>
            </div>

            <button title="Toggle theme" onClick={() => setDark(!dark)} style={{ border: "none", background: "transparent", cursor: "pointer" }}>
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button title="Settings" onClick={() => navigate("/settings")} style={{ border: "none", background: "transparent", cursor: "pointer" }}>
              <Settings size={18} />
            </button>

            <button title="Logout" onClick={logout} style={{ border: "none", background: "transparent", cursor: "pointer" }}>
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* messages */}
        <div style={{ padding: 18, display: "flex", gap: 12 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
            <AnimatePresence initial={false}>
              {messages.map((m, i) => {
                const mine = m.user === user?.name;
                return (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.28 }}
                    style={{
                      alignSelf: mine ? "flex-end" : "flex-start",
                      maxWidth: "78%",
                      display: "flex",
                      flexDirection: "column",
                      gap: 6
                    }}>
                    <div style={{
                      padding: "10px 14px",
                      borderRadius: 12,
                      background: mine ? "linear-gradient(90deg,#06b6d4,#ffd166)" : "rgba(2,6,23,0.04)",
                      color: mine ? "#042b2a" : (dark ? "#e6f7f5" : "#071826"),
                      boxShadow: mine ? "0 10px 30px rgba(6,182,212,0.08)" : "none",
                      wordBreak: "break-word"
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{m.user}</div>
                      <div style={{ marginTop: 6 }}>{m.body}</div>
                      <div style={{ marginTop: 8, fontSize: 11, opacity: 0.6, textAlign: "right" }}>
                        {new Date(m.created_at ?? m.createdAt ?? Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <div ref={endRef} />
          </div>
        </div>

        {/* input */}
        <form onSubmit={sendMessage} style={{ display: "flex", gap: 12, padding: 18, borderTop: "1px solid rgba(16,24,40,0.04)" }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1, padding: 12, borderRadius: 12, border: "1px solid rgba(16,24,40,0.04)",
              outline: "none", background: "white"
            }}
          />
          <button type="submit" className="btn" style={{ maxWidth: 140 }}>
            Send
          </button>
        </form>
      </motion.div>
    </div>
  );
}
