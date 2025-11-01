import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.get("/", (req, res) => res.send("✅ Chat backend is running"));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("send_message", (msg) => {
    io.emit("message", msg); // broadcast to everyone
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
