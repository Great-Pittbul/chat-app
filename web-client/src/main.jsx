import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Auth from "./Auth";
import Chat from "./Chat";
import Settings from "./Settings";

import "./style.css";

/* ✅ INSTANT THEME BOOTSTRAP (prevents blank UI flash) */
document.body.setAttribute(
  "data-theme",
  localStorage.getItem("theme") || "dark"
);

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/chat" /> : <Auth />} />

        <Route path="/chat" element={user ? <Chat /> : <Navigate to="/" />} />

        <Route
          path="/settings"
          element={user ? <Settings /> : <Navigate to="/" />}
        />

        {/* fallback for broken links */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
