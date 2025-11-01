import React, { useState } from "react";

const API = import.meta.env.VITE_BACKEND_URL;

export default function Auth({ setToken, setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setError("");
    const url = `${API}/${isLogin ? "login" : "signup"}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Error");
    if (isLogin) {
      setToken(data.token);
      setUser(data.name);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", data.name);
    } else setIsLogin(true);
  };

  return (
    <div style={{ maxWidth: 300, margin: "60px auto", textAlign: "center" }}>
      <h3>{isLogin ? "Login" : "Sign Up"}</h3>
      {!isLogin && (
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          style={{ marginBottom: 8 }}
        />
      )}
      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
        style={{ marginBottom: 8 }}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        style={{ marginBottom: 8 }}
      />
      <div>
        <button onClick={submit}>{isLogin ? "Login" : "Sign Up"}</button>
        <p>
          {isLogin ? "No account?" : "Have an account?"}{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign up" : "Login"}
          </span>
        </p>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
    </div>
  );
}
