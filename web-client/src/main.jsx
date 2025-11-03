import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./Auth";
import Chat from "./Chat";
import Settings from "./Settings"; // ✅ New Settings page
import "./style.css"; // Global styles

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Router>
      <Routes>
        {/* Auth route */}
        <Route path="/" element={user ? <Navigate to="/chat" /> : <Auth />} />

        {/* Chat route */}
        <Route path="/chat" element={user ? <Chat /> : <Navigate to="/" />} />

        {/* Settings route */}
        <Route path="/settings" element={user ? <Settings /> : <Navigate to="/" />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to={user ? "/chat" : "/"} />} />
      </Routes>
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
