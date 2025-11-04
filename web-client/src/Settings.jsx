import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import "./style.css";

export default function Settings() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const goBack = () => {
    window.location.href = "/chat";
  };

  const applyTheme = (t) => {
    setTheme(t);
    document.body.setAttribute("data-theme", t);
    localStorage.setItem("theme", t);
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <ArrowLeft className="icon-btn" onClick={goBack} />
        <h2>Settings</h2>
      </div>

      <div className="settings-card">
        <h3>Theme</h3>

        <div className="theme-options">
          <button
            className={theme === "dark" ? "theme-btn active" : "theme-btn"}
            onClick={() => applyTheme("dark")}
          >
            Dark
          </button>

          <button
            className={theme === "light" ? "theme-btn active" : "theme-btn"}
            onClick={() => applyTheme("light")}
          >
            Light
          </button>
        </div>
      </div>
    </div>
  );
}
