import React, { useEffect, useState, useRef } from "react";
import { Sun, Moon, Settings, LogOut } from "lucide-react";
import { io } from "socket.io-client";

const API_URL = "https://chat-app-y0st.onrender.com"; // your backend
// NOTE: keep lucide-react listed in package.json dependencies

export default function Chat() {
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [typing, setTyping] = useState(false);

  const socketRef = useRef(null);
  const endRef = useRef(null);

  // connect socket with auth token (do not auto connect until auth provided)
  useEffect(() => {
    if (!user?.token) {
      // not logged in — safe redirect
      window.location.href = "/";
      return;
    }

    socketRef.current = io(API_URL, {
      auth: { token: user.token },
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("✅ socket connected");
    });

    socketRef.current.on("history", (msgs = []) => {
      setMessages(msgs);
    });

    socketRef.current.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on("disconnect", () => {
      console.log("⚠️ socket disconnected");
    });

    return () => {
      socketRef.current?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // scroll to bottom on new message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  // theme application
  useEffect(() => {
    document.body.style.background = dark ? "#071326" : "#f6fbfd";
    document.body.style.color = dark ? "#e6f7f5" : "#102027";
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  // send message
  const sendMessage = (e) => {
    if (e) e.preventDefault();
    if (!text.trim() || !socketRef.current) return;
    const payload = { body: text.trim() };
    socketRef.current.emit("send_message", payload);
    setText("");
  };

  // logout
  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  // tiny helper for timestamp
  const timeShort = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  // avatar placeholder
  const avatarFor = (name) => {
    const initials = (name || "U").split(" ").map((s) => s[0]).slice(0, 2).join("");
    return initials.toUpperCase();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        padding: "2rem",
        boxSizing: "border-box",
        fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      }}
    >
      {/* center wrapper */}
      <div
        style={{
          width: "980px",
          maxWidth: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: dark
            ? "0 10px 40px rgba(3,12,22,0.7)"
            : "0 10px 40px rgba(16,24,40,0.08)",
          border: dark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(16,24,40,0.04)",
          background: dark
            ? "linear-gradient(180deg, rgba(6,28,37,0.85), rgba(4,18,24,0.85))"
            : "linear-gradient(180deg, rgba(255,255,255,0.8), rgba(250,252,253,0.8))",
        }}
      >
        {/* HEADER */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "18px 22px",
            backdropFilter: "blur(6px)",
            background: dark ? "rgba(7,19,30,0.35)" : "rgba(255,255,255,0.6)",
            borderBottom: dark ? "1px solid rgba(255,255,255,0.03)" : "1px solid rgba(16,24,40,0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* KUMBO gradient logo/title */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                lineHeight: 1,
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: 0.6,
                  background: dark
                    ? "linear-gradient(90deg,#06b6d4,#ffd166)"
                    : "linear-gradient(90deg,#06b6d4,#ffd166)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  textShadow: dark ? "0 6px 18px rgba(6,182,212,0.06)" : "none",
                }}
              >
                KUMBO <span style={{ fontWeight: 500, color: dark ? "#8fe6df" : "#065f7a", fontSize: 14 }}>Chat</span>
              </div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{/* tagline if desired */}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {/* avatar + name */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                title={user?.name}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  background: dark ? "linear-gradient(90deg,#064e4b,#0ea5a3)" : "linear-gradient(90deg,#06b6d4,#ffd166)",
                  color: dark ? "#071826" : "#042b2a",
                  boxShadow: "0 6px 18px rgba(6,182,212,0.12)",
                }}
              >
                {avatarFor(user?.name)}
              </div>
              <div style={{ display: "flex", flexDirection: "column", textAlign: "right" }}>
                <div style={{ fontWeight: 700 }}>{user?.name}</div>
                <div style={{ fontSize: 12, opacity: 0.6 }}>{/* small status */}Online</div>
              </div>
            </div>

            {/* theme toggle */}
            <button
              onClick={() => setDark(!dark)}
              title="Toggle theme"
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                display: "grid",
                placeItems: "center",
                border: "none",
                cursor: "pointer",
                background: dark ? "rgba(255,255,255,0.04)" : "rgba(2,6,23,0.04)",
                transition: "transform 160ms ease, box-shadow 160ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
            >
              {dark ? <Sun size={18} color="#ffd166" /> : <Moon size={18} color="#06b6d4" />}
            </button>

            <button
              onClick={() => setDrawerOpen(true)}
              title="Settings"
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                display: "grid",
                placeItems: "center",
                border: "none",
                cursor: "pointer",
                background: dark ? "rgba(255,255,255,0.03)" : "rgba(2,6,23,0.03)",
                transition: "transform 160ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
            >
              <Settings size={18} color={dark ? "#8fe6df" : "#065f7a"} />
            </button>

            <button
              onClick={logout}
              title="Logout"
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                display: "grid",
                placeItems: "center",
                border: "none",
                cursor: "pointer",
                background: "#ef4444",
                color: "white",
                transition: "transform 160ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
            >
              <LogOut size={16} color="#fff" />
            </button>
          </div>
        </header>

        {/* BODY */}
        <div
          style={{
            display: "flex",
            gap: 16,
            padding: 18,
            minHeight: 420,
            background: dark ? "linear-gradient(180deg,#071826, rgba(7,24,38,0.6))" : "linear-gradient(180deg,#f7fbfc, rgba(255,255,255,0.6))",
          }}
        >
          {/* left: optionally could add user list, but we keep focus on chat center */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: 8,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {messages.map((m, i) => {
                const mine = m.user === user?.name;
                return (
                  <div
                    key={i}
                    style={{
                      alignSelf: mine ? "flex-end" : "flex-start",
                      maxWidth: "78%",
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      transform: "translateY(0)",
                      transition: "transform 240ms ease",
                    }}
                  >
                    <div
                      style={{
                        padding: "10px 14px",
                        borderRadius: 12,
                        background: mine
                          ? dark
                            ? "linear-gradient(90deg,#0ea5a3,#ffd166)"
                            : "linear-gradient(90deg,#06b6d4,#ffd166)"
                          : dark
                          ? "rgba(255,255,255,0.03)"
                          : "rgba(2,6,23,0.04)",
                        color: mine ? (dark ? "#071826" : "#042b2a") : dark ? "#e6f7f5" : "#071826",
                        boxShadow: mine ? "0 8px 30px rgba(6,182,212,0.08)" : "none",
                        wordBreak: "break-word",
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                        {m.user}
                      </div>
                      <div style={{ fontSize: 14, lineHeight: 1.25 }}>{m.body}</div>
                      <div style={{ fontSize: 11, opacity: 0.6, marginTop: 8, textAlign: "right" }}>
                        {timeShort(m.created_at ?? m.createdAt ?? new Date().toISOString())}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>

            {/* input area fixed at bottom of container */}
            <form
              onSubmit={sendMessage}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                paddingTop: 8,
                paddingBottom: 4,
              }}
            >
              <input
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setTyping(Boolean(e.target.value));
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    sendMessage(e);
                  }
                }}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "none",
                  outline: "none",
                  background: dark ? "rgba(255,255,255,0.03)" : "rgba(2,6,23,0.03)",
                  color: dark ? "#e6f7f5" : "#071826",
                  boxShadow: dark ? "inset 0 1px 0 rgba(255,255,255,0.02)" : "inset 0 1px 0 rgba(2,6,23,0.02)",
                }}
              />
              <button
                type="submit"
                style={{
                  background: "linear-gradient(90deg,#06b6d4,#ffd166)",
                  border: "none",
                  color: "#042b2a",
                  padding: "10px 16px",
                  borderRadius: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 8px 24px rgba(6,182,212,0.12)",
                  transition: "transform 160ms ease, box-shadow 160ms ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
              >
                Send
              </button>
            </form>
          </div>

          {/* Right column: small context / placeholder (could be user list or info) */}
          <aside
            style={{
              width: 260,
              borderRadius: 12,
              padding: 12,
              backdropFilter: "blur(8px)",
              background: dark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.7)",
              border: dark ? "1px solid rgba(255,255,255,0.02)" : "1px solid rgba(16,24,40,0.04)",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              alignItems: "center",
            }}
          >
            <div style={{ width: 80, height: 80, borderRadius: 999, background: dark ? "#083237" : "#eafcfd", display: "grid", placeItems: "center", fontWeight: 800, color: dark ? "#8fe6df" : "#065f7a", fontSize: 28 }}>
              {avatarFor(user?.name)}
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 800 }}>{user?.name}</div>
              <div style={{ fontSize: 13, opacity: 0.7 }}>{user?.email}</div>
            </div>

            <div style={{ width: "100%", marginTop: 6 }}>
              <button
                onClick={() => setDrawerOpen(true)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  background: dark ? "rgba(255,255,255,0.03)" : "#f3f4f6",
                  color: dark ? "#b6fff0" : "#042b2a",
                  fontWeight: 700,
                }}
              >
                Open Settings
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Settings Drawer (Slide-in right) */}
      <div
        aria-hidden={!drawerOpen}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: drawerOpen ? 360 : 0,
          overflow: "hidden",
          transition: "width 260ms cubic-bezier(.2,.9,.2,1)",
          zIndex: 60,
          boxShadow: drawerOpen ? "-20px 0 60px rgba(2,6,23,0.4)" : "none",
        }}
      >
        <div
          style={{
            height: "100%",
            padding: 20,
            background: dark ? "#071826" : "#ffffff",
            color: dark ? "#e6f7f5" : "#071826",
            display: drawerOpen ? "flex" : "none",
            flexDirection: "column",
            gap: 16,
            width: 360,
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 800, fontSize: 18 }}>Settings</div>
            <button
              onClick={() => setDrawerOpen(false)}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 999, background: dark ? "#083237" : "#eafcfd", display: "grid", placeItems: "center", fontWeight: 800, color: dark ? "#8fe6df" : "#065f7a" }}>
              {avatarFor(user?.name)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800 }}>{user?.name}</div>
              <div style={{ fontSize: 13, opacity: 0.7 }}>{user?.email}</div>
            </div>
          </div>

          <div style={{ marginTop: 6 }}>
            <div style={{ marginBottom: 8, fontWeight: 700 }}>Display name</div>
            <input
              defaultValue={user?.name}
              onBlur={(e) => {
                const newName = e.target.value.trim();
                if (!newName) return;
                const stored = JSON.parse(localStorage.getItem("user") || "{}");
                stored.name = newName;
                localStorage.setItem("user", JSON.stringify(stored));
                // reflect immediately
                window.location.reload();
              }}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.06)",
                background: dark ? "rgba(255,255,255,0.02)" : "#fff",
                color: dark ? "#e6f7f5" : "#071826",
              }}
            />
            <div style={{ fontSize: 12, opacity: 0.6, marginTop: 6 }}>Change your display name and click outside the box to save.</div>
          </div>

          <div>
            <div style={{ marginBottom: 8, fontWeight: 700 }}>Theme</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setDark(false)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 10,
                  border: dark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(2,6,23,0.06)",
                  background: dark ? "transparent" : "linear-gradient(90deg,#06b6d4,#ffd166)",
                  color: dark ? "#e6f7f5" : "#042b2a",
                  fontWeight: 700,
                }}
              >
                Light
              </button>
              <button
                onClick={() => setDark(true)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 10,
                  border: dark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(2,6,23,0.06)",
                  background: dark ? "linear-gradient(90deg,#06b6d4,#ffd166)" : "transparent",
                  color: dark ? "#042b2a" : "#071826",
                  fontWeight: 700,
                }}
              >
                Dark
              </button>
            </div>
          </div>

          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
            <button
              onClick={() => {
                localStorage.removeItem("user");
                window.location.href = "/";
              }}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 10,
                border: "none",
                background: "#ef4444",
                color: "white",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Logout
            </button>

            <div style={{ fontSize: 12, opacity: 0.6, textAlign: "center" }}>
              © {new Date().getFullYear()} KUMBO
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
