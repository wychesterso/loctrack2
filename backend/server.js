const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("./middleware/auth");

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "superdupersecretkey";

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

// protected profile route
app.get("/profile", authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  res.json({ email: user.email });
});

// REST test route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Socket.IO setup

// authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Authentication error!"));

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    socket.userId = payload.userId;
    next();
  } catch {
    next(new Error("Authentication error!"));
  }
});

// event listener for connected sockets
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // put socket in private room for direct messaging
  socket.join(`user:${socket.userId}`);

  // receive location updates
  socket.on("location:update", async ({ lat, lng }) => {
    try {
      //// convert to PostGIS POINT WKB
      //const pointWKB = Buffer.from(`0101000020E6100000${lat.toString(16)}${lng.toString(16)}`, "hex");
      //
      // insert or update with new location
      await prisma.location.upsert({
        where: { userId: socket.userId },
        update: { lat, lng },
        create: { userId: socket.userId, lat, lng },
      });

      // insert or update user's location in PostGIS
      //await prisma.$executeRaw`
      //  INSERT INTO "Location" ("userId", "point")
      //  VALUES (${socket.userId}, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326))
      //  ON CONFLICT ("userId")
      //  DO UPDATE SET "point" = EXCLUDED."point", "updatedAt" = now();
      //`;

      // find users allowed to see this location
      const shares = await prisma.share.findMany({
        where: { fromUserId: socket.userId, isActive: true },
      });

      // send update
      shares.forEach((share) => {
        io.to(`user:${share.toUserId}`).emit("location:update", {
          userId: socket.userId,
          lat,
          lng,
        });
      });
    } catch (err) {
      console.error("Location update error: ", err);
    }
  });

  // handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
