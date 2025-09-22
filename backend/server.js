const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // TODO: restrict to frontend URL
  },
});

app.use(cors());
app.use(express.json());

// mount auth routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// REST test route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Socket.IO setup
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
