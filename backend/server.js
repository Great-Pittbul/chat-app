import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());

// Temporary in-memory users (will move to DB later)
const users = [];

// JWT middleware
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: "Invalid token" });
  }
}

// ----- AUTH ROUTES -----
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (users.find((u) => u.email === email))
    return res.status(400).json({ error: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = { id: Date.now(), name, email, password: hashed };
  users.push(user);
  res.json({ success: true });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(400).json({ error: "Invalid email or password" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Invalid email or password" });

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  res.json({ token, name: user.name });
});

// ----- CHAT SOCKET -----
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

io.on("connection", (socket) => {
  console.log("User connected:", socket.user.name);

  socket.on("send_message", (msg) => {
    io.emit("message", {
      user: socket.user.name,
      body: msg.body,
      created_at: new Date().toISOString(),
    });
  });
});

app.get("/", (req, res) => res.send("✅ Chat backend with auth running"));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Backend running on ${PORT}`));
