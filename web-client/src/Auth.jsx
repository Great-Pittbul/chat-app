import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Auth() {
  const [name, setName] = useState("");

  const login = () => {
    if (!name.trim()) return;
    localStorage.setItem("user", JSON.stringify({ name }));
    window.location.href = "/chat";
  };

  return (
    <div className="lux-center">
      <motion.div
        className="lux-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "18px" }}>
          <span className="gold">KUMBO</span>
        </h1>

        <input
          className="lux-input"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button className="lux-btn" onClick={login}>
          Continue
        </button>
      </motion.div>
    </div>
  );
}
