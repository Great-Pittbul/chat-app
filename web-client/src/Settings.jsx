import React, { useEffect, useState } from "react";
import { ArrowLeft, Sun, Moon, LogOut } from "lucide-react";
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

  function saveName() {
    const updated = { ...storedUser, name };
    localStorage.setItem("user", JSON.stringify(updated));
    alert("Updated!");
  }

  function logout() {
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <div className="settings-bg">
      <button className="back-btn" onClick={() => navigate("/chat")}>
        <ArrowLeft size={24} />
      </button>

      <div className="settings-card">
        <h2>Settings</h2>

        <div className="setting-item">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <button onClick={saveName}>Save</button>
        </div>

        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          Toggle Theme
        </button>

        <button className="logout-btn" onClick={logout}>
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}
