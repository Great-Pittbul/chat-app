import React, { useState } from "react";

const API_URL = "https://chat-app-y0st.onrender.com";

export default function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const theme = localStorage.getItem("theme") || "light";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isSignup ? "/signup" : "/login";
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isSignup ? { name, email, password } : { email, password }
        ),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      if (isSignup) {
        alert("✅ Signup successful! Please log in.");
        setIsSignup(false);
      } else {
        localStorage.setItem("user", JSON.stringify(data));
        window.location.href = "/chat";
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        background:
          theme === "dark"
            ? "linear-gradient(135deg, #0f172a, #1e293b)"
            : "linear-gradient(135deg, #e0f2fe, #f8fafc)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "0.4s ease",
      }}
    >
      <div
        style={{
          width: "350px",
          background:
            theme === "dark"
              ? "rgba(30, 41, 59, 0.9)"
              : "rgba(255, 255, 255, 0.9)",
          boxShadow:
            theme === "dark"
              ? "0 0 20px rgba(255,255,255,0.05)"
              : "0 4px 20px rgba(0,0,0,0.1)",
          padding: "2rem",
          borderRadius: "16px",
          backdropFilter: "blur(10px)",
          textAlign: "center",
          color: theme === "dark" ? "white" : "#1e293b",
          transition: "0.3s ease",
        }}
      >
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          💬 Welcome to <span style={{ color: "#2563eb" }}>KUMBO</span>
        </h1>
        <p style={{ opacity: 0.8, marginBottom: "1.5rem" }}>
          {isSignup ? "Create your account" : "Login to continue"}
        </p>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle(theme)}
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle(theme)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle(theme)}
          />

          {error && (
            <p style={{ color: "#ef4444", marginBottom: "1rem", fontSize: "0.9rem" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: "#2563eb",
              color: "white",
              fontWeight: "bold",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
          >
            {loading
              ? "Please wait..."
              : isSignup
              ? "Sign Up"
              : "Log In"}
          </button>
        </form>

        <p style={{ marginTop: "1.2rem" }}>
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            onClick={() => setIsSignup(!isSignup)}
            style={{
              color: "#2563eb",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#1d4ed8")}
            onMouseLeave={(e) => (e.target.style.color = "#2563eb")}
          >
            {isSignup ? "Login" : "Sign up"}
          </span>
        </p>
      </div>
    </div>
  );
}

const inputStyle = (theme) => ({
  width: "100%",
  padding: "12px",
  marginBottom: "1rem",
  borderRadius: "8px",
  border: "1px solid #64748b",
  background: theme === "dark" ? "#1e293b" : "#fff",
  color: theme === "dark" ? "white" : "black",
  outline: "none",
  fontSize: "1rem",
  transition: "0.3s",
});
