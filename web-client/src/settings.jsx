import React, { useState, useEffect } from "react";

export default function Settings() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center transition-all duration-700"
      style={{
        background:
          theme === "dark"
            ? "linear-gradient(135deg, #111827, #1f2937)"
            : "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
        color: theme === "dark" ? "white" : "black",
      }}
    >
      <div
        className="w-96 p-8 rounded-2xl shadow-2xl transition-all duration-500"
        style={{
          backgroundColor:
            theme === "dark" ? "rgba(17,24,39,0.9)" : "rgba(255,255,255,0.9)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">⚙️ Settings</h2>

        <div className="space-y-4">
          <div className="bg-gray-800 text-white rounded-lg p-4">
            <p className="font-semibold text-lg">{user?.name || "User"}</p>
            <p className="text-gray-400 text-sm">{user?.email}</p>
          </div>

          <div className="flex items-center justify-between mt-6">
            <span className="text-sm font-medium">Dark Mode</span>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                theme === "dark" ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`transform transition-transform inline-block w-4 h-4 bg-white rounded-full ${
                  theme === "dark" ? "translate-x-6" : "translate-x-1"
                }`}
              ></span>
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full mt-8 py-3 rounded-lg font-semibold bg-red-600 hover:bg-red-700 transition-all duration-300 shadow-lg text-white"
          >
            Logout
          </button>

          <button
            onClick={() => alert("Preferences saved successfully ✅")}
            className="w-full mt-4 py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-lg text-white"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
