import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import KumboLogo from "./components/KumboLogo";

export default function Settings() {
  const nav = useNavigate();
  const stored = JSON.parse(localStorage.getItem("user"));
  const [name, setName] = useState(stored?.name || "");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function save() {
    const updated = { ...stored, name };
    localStorage.setItem("user", JSON.stringify(updated));
    alert("Updated!");
  }

  return (
    <div className="settings-bg">
      <div className="settings-box glass">
        <KumboLogo size={60} />

        <h1 className="settings-title">Settings</h1>

        <div className="form-row">
          <label>Name</label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <button className="btn-primary" onClick={save}>Save</button>

        <button
          className="btn-secondary"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          Toggle Theme
        </button>

        <button
          className="btn-danger"
          onClick={() => {
            localStorage.removeItem("user");
            nav("/");
          }}
        >
          Logout
        </button>

        <button className="back-btn" onClick={() => nav("/chat")}>
          ← Back
        </button>
      </div>
    </div>
  );
}
