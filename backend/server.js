import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// ✅ Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ----- SCHEMAS -----
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  avatar: String
});

const messageSchema = new mongoose.Schema({
  user: String,
  body: String,
  created_at: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
const Message = mongoose.model("Message", messageSchema);

// ----- AUTH -----
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// ----- SOCKET CHAT -----
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("No token"));
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = user;
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

io.on("connection", async (socket) => {
  console.log(`💬 ${socket.user.name} connected`);

  // Send last 20 messages
  const lastMessages = await Message.find().sort({ created_at: 1 }).limit(20);
  socket.emit("history", lastMessages);

  socket.on("send_message", async (msg) => {
    const message = await Message.create({
      user: socket.user.name,
      body: msg.body
    });
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log(`❌ ${socket.user.name} disconnected`);
  });
});

app.get("/", (req, res) => res.send("✅ Backend with Auth & Chat is live"));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
