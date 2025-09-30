const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "superdupersecretkey";

// middleware to check JWT
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Missing token" });

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// create new share
router.post("/", authMiddleware, async (req, res) => {
  const { toUserId } = req.body;
  if (!toUserId) return res.status(400).json({ error: "Missing toUserId" });
  if (toUserId === req.userId) return res.status(400).json({ error: "Cannot share with yourself!" });

  try {
    const share = await prisma.share.upsert({
      where: { fromUserId_toUserId: { fromUserId: req.userId, toUserId } },
      update: { isActive: true },
      create: { fromUserId: req.userId, toUserId },
    });
    res.json(share);
  } catch (err) {
    res.status(400).json({ error: "Failed to create share!" });
  }
});

// list all shares (incoming & outgoing)
router.get("/", authMiddleware, async (req, res) => {
  const shares = await prisma.share.findMany({
    where: {
      OR: [
        { fromUserId: req.userId, isActive: true },
        { toUserId: req.userId, isActive: true },
      ],
    },
    include: {
      fromUser: { select: { id: true, email: true } },
      toUser: { select: { id: true, email: true } },
    },
  });
  res.json(shares);
});

// remove a share
router.delete("/:toUserId", authMiddleware, async (req, res) => {
  const toUserId = parseInt(req.params.toUserId, 10);

  try {
    await prisma.share.update({
      where: { fromUserId_toUserId: { fromUserId: req.userId, toUserId } },
      data: { isActive: false },
    });
    res.json({ success: true });
  } catch {
    res.status(404).json({ error: "Share not found!" });
  }
});

module.exports = router;
