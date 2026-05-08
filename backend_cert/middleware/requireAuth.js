const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { isMongoConnected, readDb } = require("../storage");

module.exports = async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "local-dev-secret");

    if (!isMongoConnected()) {
      const db = readDb();
      const user = db.users.find((item) => item._id === payload.id && item.permission);

      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { password, ...safeUser } = user;
      req.user = safeUser;
      return next();
    }

    const user = await User.findById(payload.id).select("-password");

    if (!user || !user.permission) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
