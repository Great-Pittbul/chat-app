import React, { useState, useEffect } from "react";
import { X, Moon, Sun, LogOut } from "lucide-react";

export default function Settings() {
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.body.style.background = dark ? "#0f172a" : "#f8fafc";
    document.body.style.color = dark ? "white" : "black";
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: dark ? "#0f172a" : "#f1f5f9",
        transition: "0.3s",
      }}
    >
      <div
        style={{
          width: "360px",
          background: dark ? "#1e293b" : "white",
          padding: "2rem",
          borderRadius: "16px",
          boxShadow: dark
            ? "0 0 12px rgba(255,255,255,0.1)"
            : "0 4px 12px rgba(0,0,0,0.1)",
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={() => (window.location.href = "/chat")}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: dark ? "#fca5a5" : "#ef4444",
            transition: "0.3s",
          }}
        >
          <X size={22} />
        </button>

        <h2
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            fontSize: "1.4rem",
            fontWeight: "bold",
          }}
        >
          ⚙️ App Settings
        </h2>

        {/* Theme toggle */}
        <button
          onClick={() => setDark(!dark)}
          style={{
            width: "100%",
            padding: "12px",
            background: dark ? "#2563eb" : "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "1rem",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = dark ? "#2563eb" : "#3b82f6")}
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
          Toggle {dark ? "Light" : "Dark"} Mode
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          style={{
            width: "100%",
            padding: "12px",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#b91c1c")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#ef4444")}
        >
          <LogOut size={18} />
          Logout
        </button>

        {/* Footer */}
        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.85rem",
            color: dark ? "#9ca3af" : "#6b7280",
          }}
        >
          © {new Date().getFullYear()} UCEM Chat App
        </p>
      </div>
    </div>
  );
}
