import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, User, ArrowRight } from "lucide-react";

const API_URL = "https://chat-app-y0st.onrender.com";

export default function Auth() {
  const [mode, setMode] = useState("login"); // login | signup
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key, val) => setForm({ ...form, [key]: val });

  const submit = async () => {
    setLoading(true);
    setError("");

    try {
      const endpoint = mode === "login" ? "/login" : "/signup";

      const res = await fetch(API_URL + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      if (mode === "login") {
        localStorage.setItem("user", JSON.stringify(data));
        window.location.href = "/chat";
      } else {
        setMode("login");
      }
    } catch (err) {
      setError("Network error");
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Logo */}
        <motion.h1
          className="auth-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          KUMBO
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="auth-sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {mode === "login" ? "Welcome back ✨" : "Create your premium space ✨"}
        </motion.p>

        {/* Form fields */}
        <div className="auth-fields">
          {mode === "signup" && (
            <div className="auth-input">
              <User size={18} />
              <input
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </div>
          )}

          <div className="auth-input">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>

          <div className="auth-input">
            <Lock size={18} />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
            />
          </div>
        </div>

        {/* Error message */}
        {error && <p className="auth-error">{error}</p>}

        {/* Submit button */}
        <motion.button
          className="auth-btn"
          onClick={submit}
          disabled={loading}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
          <ArrowRight size={18} />
        </motion.button>

        {/* Switch mode */}
        <p className="auth-switch">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <span onClick={() => setMode("signup")}>Sign up</span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={() => setMode("login")}>Login</span>
            </>
          )}
        </p>
      </motion.div>
    </div>
  );
}
