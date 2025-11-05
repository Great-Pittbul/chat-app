import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const API = import.meta.env.VITE_API_URL || "https://chat-app-y0st.onrender.com";

  const handleAuth = async () => {
    setError("");

    try {
      const endpoint = isLogin ? "/login" : "/signup";
      const body = isLogin
        ? { email, password }
        : { name, email, password };

      const res = await fetch(API + endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Authentication failed");
        return;
      }

      // Save user
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/chat";
    } catch (err) {
      setError("Network error — try again.");
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-box glass-panel"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        {/* Title */}
        <motion.h2
          className="auth-title"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          KUMBO
        </motion.h2>

        {/* Toggle buttons */}
        <motion.div
          className="auth-toggle"
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 18,
            gap: 14
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            className={`btn-alt ${isLogin ? "" : "active"}`}
            style={{
              width: "50%",
            }}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>

          <button
            className={`btn-alt ${isLogin ? "active" : ""}`}
            style={{
              width: "50%",
            }}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
        </motion.div>

        {/* Name field (only signup) */}
        {!isLogin && (
          <motion.input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}

        {/* Email */}
        <motion.input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        />

        {/* Password */}
        <motion.input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        />

        {/* Error message */}
        {error && (
          <motion.div
            style={{
              marginTop: 10,
              marginBottom: 10,
              color: "#ff7777",
              textAlign: "center",
              fontSize: 14,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        {/* Submit */}
        <motion.button
          onClick={handleAuth}
          className="luxury-btn"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {isLogin ? "Login" : "Create Account"}
        </motion.button>
      </motion.div>
    </div>
  );
}
