import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Moon, Sun, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="lux-center">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="lux-card"
        style={{ textAlign: "center" }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate("/chat")}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            position: "absolute",
            left: "22px",
            top: "22px",
          }}
        >
          <ArrowLeft size={22} color="var(--gold)" />
        </button>

        {/* Title */}
        <h2 className="gold" style={{ fontSize: 26, marginBottom: 30 }}>
          Settings
        </h2>

        {/* Theme Toggle */}
        <div
          style={{
            padding: "14px 20px",
            borderRadius: "var(--radius)",
            border: "1px solid var(--gold-light)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 26,
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 500 }}>Theme</span>

          <button
            onClick={() =>
              setTheme(theme === "light" ? "dark" : "light")
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "var(--gold)",
              border: "none",
              padding: "10px 18px",
              borderRadius: "var(--radius)",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {theme === "light" ? (
              <>
                <Moon size={18} /> Dark
              </>
            ) : (
              <>
                <Sun size={18} /> Light
              </>
            )}
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="lux-btn"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
          }}
        >
          <LogOut size={18} /> Logout
        </button>
      </motion.div>
    </div>
  );
}
