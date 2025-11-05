import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LogOut, UploadCloud, Shield, Bell, Image as Img, Phone } from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();

  const stored = JSON.parse(localStorage.getItem("user") || "{}");

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [name, setName] = useState(stored.name || "");
  const [phone, setPhone] = useState(stored.phone || "");
  const [avatar, setAvatar] = useState(stored.avatar || "");

  // --- theme engine ---
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // --- Save Profile Info ---
  const saveProfile = () => {
    if (!name.trim()) return alert("Enter a name");
    const updated = { ...stored, name, phone, avatar };
    localStorage.setItem("user", JSON.stringify(updated));
    alert("Profile Updated!");
  };

  // --- Avatar Upload ---
  const loadAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
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

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div className="kumbo-logo" style={{ fontSize: 28 }}>KUMBO</div>
            <div className="kumbo-tagline">Connect. Evolve. Belong.</div>
          </div>

          {/* AVATAR */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <img
              src={avatar || "/default-avatar.png"}
              alt="avatar"
              style={{
                width: 105,
                height: 105,
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid var(--gold)",
                boxShadow: "0 0 12px var(--gold-shadow)"
              }}
            />
            <label className="btn-ghost" style={{ marginTop: 10, cursor: "pointer" }}>
              <UploadCloud size={16} /> Upload Photo
              <input
                type="file"
                style={{ display: "none" }}
                accept="image/*"
                onChange={loadAvatar}
              />
            </label>
          </div>

          {/* NAME */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: 700, display: "block", marginBottom: 6 }}>Display Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          {/* PHONE NUMBER */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: 700, display: "block", marginBottom: 6 }}>Phone Number</label>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <Phone size={18} />
              <input
                type="tel"
                className="input"
                placeholder="+234 801 234 5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* SAVE */}
          <button className="btn" onClick={saveProfile} style={{ width: "100%", marginBottom: 20 }}>
            Save Profile
          </button>

          {/* THEME */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontWeight: 700, display: "block", marginBottom: 8 }}>Theme</label>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-ghost" onClick={() => setTheme("light")}>Light</button>
              <button className="btn" onClick={() => setTheme("dark-navy")}>Dark Navy</button>
            </div>
          </div>

          {/* PRIVACY & SECURITY */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontWeight: 700, display: "block", marginBottom: 10 }}>
              <Shield size={16} /> &nbsp; Privacy & Security
            </label>
            <div className="settings-item">Last Seen</div>
            <div className="settings-item">Read Receipts</div>
            <div className="settings-item">Blocked Contacts</div>
            <div className="settings-item">Two-Step Verification</div>
          </div>

          {/* MEDIA */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontWeight: 700, display: "block", marginBottom: 10 }}>
              <Img size={16} /> &nbsp; Media Preferences
            </label>
            <div className="settings-item">Image Quality: Auto</div>
            <div className="settings-item">Video Upload Quality</div>
            <div className="settings-item">Document Preview</div>
          </div>

          {/* NOTIFICATIONS */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontWeight: 700, display: "block", marginBottom: 10 }}>
              <Bell size={16} /> &nbsp; Notifications
            </label>
            <div className="settings-item">Message Alerts</div>
            <div className="settings-item">In-App Sounds</div>
            <div className="settings-item">Popup Notifications</div>
          </div>

          {/* LOGOUT */}
          <button className="btn" onClick={logout} style={{ background: "#ef4444", color: "white", width: "100%" }}>
            <LogOut size={16} /> &nbsp; Logout
          </button>

        </div>
      </motion.div>
    </div>
  );
}
