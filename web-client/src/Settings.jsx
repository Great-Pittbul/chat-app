import React, { useState, useEffect } from "react";
import { ArrowLeft, LogOut, Sun, Moon, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  })();

  const [name, setName] = useState(storedUser?.name || "");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const saveName = () => {
    const updated = { ...storedUser, name };
    localStorage.setItem("user", JSON.stringify(updated));
    alert("Name updated!");
  };

  return (
    <div className="settings-page">

      <button className="back-btn" onClick={() => navigate("/chat")}>
        <ArrowLeft />
      </button>

      <h1>Settings</h1>
      <p>Manage preferences</p>

      <div className="settings-item">
        <User />
        <input
          type="text"
          value={name}
          placeholder="Enter new display name"
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={saveName}>Save</button>
      </div>

      <button
        className="settings-btn"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? <Sun /> : <Moon />}
        Toggle {theme === "dark" ? "Light" : "Dark"} Mode
      </button>

      <button
        className="logout-btn-red"
        onClick={() => {
          localStorage.removeItem("user");
          navigate("/");
        }}
      >
        <LogOut /> Logout
      </button>

    </div>
  );
}
