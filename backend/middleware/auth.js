const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "superdupersecretkey";

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing token!" });

  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token!" });
  }
}

module.exports = authMiddleware;
