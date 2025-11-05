import React, { useState } from "react";
import KumboLogo from "./components/KumboLogo";

const API_URL = "https://chat-app-y0st.onrender.com";

export default function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isSignup ? "/signup" : "/login";
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
      if (!res.ok) throw new Error(data.error || "Failed");

      if (isSignup) {
        alert("Signup successful. Please log in.");
        setIsSignup(false);
      } else {
        localStorage.setItem("user", JSON.stringify(data));
        window.location.href = "/chat";
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  }

  return (
    <div className="auth-bg">
      <div className="auth-box glass">
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <KumboLogo size={70} />
        </div>

        <h1 className="auth-title">Welcome to KUMBO</h1>

        <p className="auth-sub">{isSignup ? "Create Account" : "Sign In"}</p>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              className="input"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            className="input"
            placeholder="Email Address"
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
            required
          />

          {error && <p className="error">{error}</p>}

          <button className="btn-primary" disabled={loading}>
            {loading ? "Please wait..." : isSignup ? "Sign Up" : "Log In"}
          </button>
        </form>

        <p className="switch-auth">
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <span onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "Login" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
}
