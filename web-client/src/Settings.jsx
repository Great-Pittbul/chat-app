import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function Settings() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const applyTheme = (t) => {
    setTheme(t);
    document.body.setAttribute("data-theme", t);
    localStorage.setItem("theme", t);
  };

  return (
    <div className="lux-center">
      <div className="lux-card" style={{ maxWidth: 460 }}>
        <a href="/chat" style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
          <ArrowLeft size={22} color="var(--gold)" />
          <span style={{ marginLeft: 8 }}>Back</span>
        </a>

        <h2 className="gold" style={{ marginBottom: 20 }}>Settings</h2>

        <p style={{ marginBottom: 10 }}>Theme</p>

        <button
          className="lux-btn"
          style={{ marginTop: 0 }}
          onClick={() => applyTheme("dark")}
        >
          Dark Mode
        </button>

        <button
          className="lux-btn"
          onClick={() => applyTheme("light")}
        >
          Light Mode
        </button>
      </div>
    </div>
  );
}
