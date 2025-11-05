import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Kumbologo from "./components/KumboLogo.jsx";

const API_URL = "https://chat-backend-kumbo.onrender.com";

export default function Auth() {
  const nav = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toggle = () => setIsSignup(!isSignup);

  async function submit() {
    const endpoint = isSignup ? "/signup" : "/login";

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isSignup
            ? { name, email, password }
            : { email, password }
        ),
      });

      const data = await res.json();
      if (!data.token && !isSignup) {
        alert(data.error || "Login failed");
        return;
      }

      if (!isSignup) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({ name: data.name }));
        nav("/chat");
      } else {
        alert("Account created. Please login.");
        setIsSignup(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="auth-container">
      <Kumbologo />

      <div className="auth-card">
        <h2>{isSignup ? "Create Account" : "Login"}</h2>

        {isSignup && (
          <input
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="auth-btn" onClick={submit}>
          {isSignup ? "Sign up" : "Login"}
        </button>

        <p className="toggle" onClick={toggle}>
          {isSignup ? "Already have an account? Login" : "Create an account"}
        </p>
      </div>
    </div>
  );
}
