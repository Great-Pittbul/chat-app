import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();
  const stored = JSON.parse(localStorage.getItem("user") || "{}");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [name, setName] = useState(stored.name || "");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const saveName = () => {
    if (!name.trim()) return alert("Enter a name");
    const u = { ...stored, name };
    localStorage.setItem("user", JSON.stringify(u));
    alert("Name saved");
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="app-centered">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{ width: 420, maxWidth: "95%" }}
      >
        <div className="auth-card" style={{ padding: 20 }}>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <div className="kumbo-logo" style={{ fontSize: 26 }}>KUMBO</div>
            <div className="kumbo-tagline">Connect. Evolve. Belong.</div>
          </div>

          <div style={{ marginTop: 8 }}>
            <label style={{ fontWeight: 700, display: "block", marginBottom: 8 }}>Display name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button className="btn" onClick={saveName}>Save</button>
              <button className="btn-ghost" onClick={() => navigate("/chat")}>Back</button>
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <label style={{ fontWeight: 700, display: "block", marginBottom: 8 }}>Theme</label>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-ghost" onClick={() => setTheme("light")}>Light</button>
              <button className="btn" onClick={() => setTheme("dark")} style={{ maxWidth: 110 }}>Dark</button>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <button className="btn" onClick={logout} style={{ background: "#ef4444", color: "white" }}>
              <LogOut size={16} /> &nbsp; Logout
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
