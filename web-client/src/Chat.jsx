import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { LogOut, Settings, Send, Sun, Moon } from "lucide-react";

const API_URL = "https://chat-app-y0st.onrender.com";
const socket = io(API_URL, {
  autoConnect: false,
});

export default function Chat() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!user) return;

    socket.auth = { token: user.token };
    socket.connect();

    socket.on("history", (msgs) => setMessages(msgs));
    socket.on("message", (msg) => setMessages((prev) => [...prev, msg]));

    return () => socket.disconnect();
  }, [user]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    socket.emit("send_message", { body: input });
    setInput("");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-all duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-700">
        <h1 className="text-xl font-semibold">💬 Chat Room</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full hover:bg-gray-700 transition-all"
            title="Settings"
          >
            <Settings size={22} />
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-xs p-3 rounded-xl ${
              msg.user === user.name
                ? "bg-blue-600 text-white ml-auto"
                : darkMode
                ? "bg-gray-700"
                : "bg-gray-200"
            }`}
          >
            <strong>{msg.user}:</strong> <span>{msg.body}</span>
          </div>
        ))}
      </main>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="flex items-center gap-2 p-4 border-t border-gray-700"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className={`flex-1 px-4 py-2 rounded-lg outline-none ${
            darkMode
              ? "bg-gray-800 text-white placeholder-gray-400"
              : "bg-white text-gray-900 placeholder-gray-500"
          }`}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-1 transition-all"
        >
          <Send size={18} /> Send
        </button>
      </form>

      {/* Settings Panel */}
      {showSettings && (
        <div
          className={`absolute top-0 right-0 h-full w-64 p-6 shadow-lg border-l border-gray-700 transform transition-all duration-300 ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
        >
          <h2 className="text-lg font-semibold mb-4">⚙️ Settings</h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 mb-4 w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg transition-all"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
