import React, { useState } from "react";

const API_BASE = "https://chat-app-2-9qbx.onrender.com"; // your backend URL

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const endpoint = isLogin ? "/login" : "/signup";
    const body = isLogin
      ? { email, password }
      : { name, email, password };

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (isLogin) {
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", data.name);
        window.location.href = "/chat"; // redirect to chat
      } else {
        alert(data.error || "Login failed");
      }
    } else {
      if (data.success) {
        alert("Signup successful! Please login.");
        setIsLogin(true);
      } else {
        alert(data.error || "Signup failed");
      }
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#0d1117",
        color: "#fff",
      }}
    >
      <div
        style={{
          background: "#161b22",
          padding: "2rem",
          borderRadius: "1rem",
          width: "300px",
          textAlign: "center",
        }}
      >
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p style={{ marginTop: "1rem", cursor: "pointer" }}>
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <span
                style={{ color: "#58a6ff" }}
                onClick={() => setIsLogin(false)}
              >
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                style={{ color: "#58a6ff" }}
                onClick={() => setIsLogin(true)}
              >
                Login
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

const styles = {
  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "5px",
    border: "1px solid #30363d",
    background: "#0d1117",
    color: "#fff",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#238636",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
