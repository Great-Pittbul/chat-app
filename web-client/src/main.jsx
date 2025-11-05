import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./Auth.jsx";
import Chat from "./Chat.jsx";
import Settings from "./Settings.jsx";
import "./style.css";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));
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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
