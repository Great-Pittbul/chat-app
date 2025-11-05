import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import fs from "fs";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// ✅ Load JWT Secret
const JWT_SECRET =
  process.env.JWT_SECRET ||
  fs.readFileSync("/etc/secrets/JWT_SECRET", "utf8").trim();

// ✅ Connect Mongo
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ✅ SCHEMAS
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const messageSchema = new mongoose.Schema({
  user: String,
  body: String,
  created_at: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
const Message = mongoose.model("Message", messageSchema);

// ✅ SIGNUP
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already exists" });

    await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
});

// ✅ LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, name: user.name });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// ✅ FETCH MESSAGES (for your React frontend)
app.get("/messages", async (req, res) => {
  try {
    const msgs = await Message.find().sort({ created_at: 1 }).limit(50);
    res.json(msgs);
  } catch {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// ✅ SEND MESSAGE (HTTP fallback)
app.post("/send", async (req, res) => {
  try {
    const { user, body } = req.body;
    const msg = await Message.create({ user, body });

    io.emit("message", msg);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to send message" });
  }
});

// ✅ SOCKET AUTH
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token"));
    socket.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

// ✅ SOCKET EVENTS
io.on("connection", async (socket) => {
  console.log("✅ Socket connected:", socket.user.name);

  socket.emit("history", await Message.find().sort({ created_at: 1 }).limit(50));

  socket.on("send_message", async (data) => {
    const msg = await Message.create({
      user: socket.user.name,
      body: data.body,
    });

    io.emit("message", msg);
  });
});

app.get("/", (req, res) => res.send("✅ Backend is running"));

// ✅ Startup
server.listen(process.env.PORT || 3000, () =>
  console.log("🚀 Server running")
);
