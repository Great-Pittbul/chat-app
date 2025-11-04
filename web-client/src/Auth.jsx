import React, { useState } from "react";
import { LogIn } from "lucide-react";
import "./style.css";

export default function Auth() {
  const [name, setName] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const user = { name };
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "/chat";
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">KUMBO</h1>

        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="text"
            placeholder="Enter display name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="auth-input"
          />

          <button className="auth-btn">
            <LogIn size={18} /> Continue
          </button>
        </form>
      </div>
    </div>
  );
}
