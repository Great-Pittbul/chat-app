import React, { useState } from "react";

const API_URL = "https://chat-app-y0st.onrender.com"; // ✅ Your live backend

export default function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isSignup ? "/signup" : "/login";

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      if (isSignup && data.success) {
        alert("Signup successful! You can now log in.");
        setIsSignup(false);
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data));
      window.location.href = "/chat";
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen transition-all duration-700"
      style={{
        background: isSignup
          ? "linear-gradient(135deg, #2563eb, #1e3a8a)"
          : "linear-gradient(135deg, #111827, #1f2937)",
        color: "white",
      }}
    >
      <div
        className="w-96 p-8 rounded-2xl shadow-2xl transition-all duration-500"
        style={{
          backgroundColor: "rgba(17,24,39,0.9)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition-all duration-300 ${
              isSignup
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-green-600 hover:bg-green-700"
            } ${loading && "opacity-70 cursor-not-allowed"}`}
          >
            {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm">
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <span
            className="text-blue-400 hover:underline cursor-pointer transition-all"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </div>
      </div>
    </div>
  );
}
