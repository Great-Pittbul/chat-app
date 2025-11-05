import React, { useState, useEffect } from "react";
import { ArrowLeft, LogOut, User, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [name, setName] = useState(storedUser?.name || "");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleSaveName = () => {
    if (!name.trim()) return;
    const updatedUser = { ...storedUser, name };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    alert("✅ Name updated successfully!");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: theme === "dark" ? "#0f172a" : "#f1f5f9",
        color: theme === "dark" ? "white" : "black",
        transition: "0.3s",
        position: "relative",
      }}
    >
      {/* Back to Chat */}
      <button
        onClick={() => navigate("/chat")}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: theme === "dark" ? "#93c5fd" : "#2563eb",
        }}
      >
        <ArrowLeft size={24} />
      </button>

      {/* Brand */}
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⚙️ KUMBO Settings</h1>
      <p style={{ opacity: 0.7, marginBottom: "2rem" }}>Manage your preferences</p>

      {/* Name Update */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <User size={20} />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter new display name"
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #64748b",
            outline: "none",
            background: theme === "dark" ? "#1e293b" : "white",
            color: theme === "dark" ? "white" : "black",
          }}
        />
        <button
          onClick={handleSaveName}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            padding: "10px 14px",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
        >
          Save
        </button>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        style={{
          width: "250px",
          padding: "10px",
          marginBottom: "1rem",
          background: theme === "dark" ? "#2563eb" : "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "0.3s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = theme === "dark" ? "#2563eb" : "#3b82f6")}
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        Toggle {theme === "dark" ? "Light" : "Dark"} Mode
      </button>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          width: "250px",
          padding: "10px",
          background: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "0.3s",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#b91c1c")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#ef4444")}
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}
