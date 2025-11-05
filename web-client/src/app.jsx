import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./Auth";
import Chat from "./Chat";
import Settings from "./Settings";

function safeUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export default function App() {
  const user = safeUser();

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/chat" /> : <Auth />} />
        <Route path="/chat" element={user ? <Chat /> : <Navigate to="/" />} />
        <Route path="/settings" element={user ? <Settings /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to={user ? "/chat" : "/"} />} />
      </Routes>
    </Router>
  );
}
