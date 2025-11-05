import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const API_URL = "https://chat-app-y0st.onrender.com";

export default function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [playIntro, setPlayIntro] = useState(false);

  useEffect(() => {
    // play logo intro once per session
    const seen = sessionStorage.getItem("kumbo_logo_seen");
    if (!seen) {
      setPlayIntro(true);
      sessionStorage.setItem("kumbo_logo_seen", "1");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const endpoint = isSignup ? "/signup" : "/login";
      const body = isSignup ? { name, email, password } : { email, password };

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

      if (isSignup && data.success) {
        // tell user and switch to login
        alert("Signup successful. Please log in.");
        setIsSignup(false);
        setBusy(false);
        return;
      }

      // login successful -> store user object (backend returns { token, name })
      localStorage.setItem("user", JSON.stringify(data));
      window.location.href = "/chat";
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="app-centered" style={{ background: "linear-gradient(180deg,#eef7ff,#f5f8ff)" }}>
      <motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", marginBottom: 12 }}
      >
        {/* Animated Logo reveal (plays once) */}
        <motion.div
          initial={playIntro ? { opacity: 0, y: -20, scale: 0.98 } : false}
          animate={playIntro ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1 }}
          transition={{ duration: 0.8, ease: "circOut" }}
        >
          <div style={{ display: "inline-block", textAlign: "center" }}>
            <div className="kumbo-logo" style={{ fontSize: 30 }}>KUMBO</div>
            <div className="kumbo-tagline">Connect. Evolve. Belong.</div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <h3 style={{ margin: 0, marginBottom: 10, textAlign: "center", fontSize: 18, fontWeight: 700 }}>
          {isSignup ? "Create your KUMBO account" : "Welcome back"}
        </h3>

        <form onSubmit={handleSubmit} style={{ marginTop: 8 }}>
          {isSignup && (
            <input
              className="input"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            className="input"
            placeholder="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          {error && <div style={{ color: "#ef4444", marginBottom: 8 }}>{error}</div>}

          <button className="btn" type="submit" disabled={busy}>
            {busy ? "Please wait..." : isSignup ? "Create account" : "Log in"}
          </button>
        </form>

        <div style={{ marginTop: 12, textAlign: "center" }}>
          <button
            className="btn-ghost"
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
            }}
          >
            {isSignup ? "Have an account? Log in" : "New here? Create account"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
