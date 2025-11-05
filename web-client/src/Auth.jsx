import React, { useState } from "react";
import { motion } from "framer-motion";
import KumboLogo from "./components/KumboLogo";

const API_URL = "https://chat-app-y0st.onrender.com";

export default function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleAuth() {
    const endpoint = isSignup ? "/signup" : "/login";

    if (isSignup && !name.trim()) return alert("Enter your name");

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isSignup ? { name, email, password } : { email, password }
        ),
      });

      const data = await res.json();
      if (!data.success) return alert(data.message);

      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/chat";
    } catch (err) {
      alert("Failed to connect.");
    }
  }

  return (
    <div className="auth-bg">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <KumboLogo size={80} />
        <h2 className="auth-title">{isSignup ? "Create Account" : "Welcome Back"}</h2>

        {isSignup && (
          <input
            className="auth-input"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          className="auth-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="auth-btn" onClick={handleAuth}>
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p
          className="auth-switch"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? "Already have an account?" : "Create an account"}
        </p>
      </motion.div>
    </div>
  );
}
