import React, { useState } from "react";

const API_URL = "https://chat-app-y0st.onrender.com"; // no /api prefix!

export default function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = isSignup ? "/signup" : "/login";

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // ✅ Backend returns { token, name } on login, { success: true } on signup
      if (isSignup && data.success) {
        alert("Signup successful! You can now log in.");
        setIsSignup(false);
        return;
      }

      // Save token + user info
      localStorage.setItem("user", JSON.stringify(data));
      window.location.href = "/chat";
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #1f2937, #4b5563)",
        color: "white",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "350px",
          padding: "2rem",
          backgroundColor: "#111827",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>

        {isSignup && (
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}

        <button
          type="submit"
          style={{
            ...inputStyle,
            backgroundColor: "#2563eb",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            style={{ color: "#60a5fa", cursor: "pointer" }}
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "8px 0",
  borderRadius: "6px",
  border: "1px solid #374151",
  outline: "none",
  backgroundColor: "#1f2937",
  color: "white",
};
