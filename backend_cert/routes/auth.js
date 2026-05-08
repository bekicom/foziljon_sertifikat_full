const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { isMongoConnected, readDb } = require("../storage");

const router = express.Router();

function createToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "local-dev-secret", {
    expiresIn: "7d",
  });
}

router.post("/login", async (req, res) => {
  const username = String(req.body.username || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!username || !password) {
    return res.status(400).json({ error: "Login va parol kerak" });
  }

  try {
    if (!isMongoConnected()) {
      const db = readDb();
      const user = db.users.find(
        (item) => item.username === username && item.password === password && item.permission
      );

      if (!user) {
        return res.status(400).json({ error: "Login yoki parol noto'g'ri" });
      }

      return res.json({
        username: user.username,
        token: createToken(user),
        role: user.role,
        id: user._id,
        subject: user.subject,
        name: user.name,
        lastname: user.lastname,
      });
    }

    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: "Login yoki parol noto'g'ri" });
    }

    if (!user.permission) {
      return res.status(403).json({ error: "Kirishga ruxsat yo'q" });
    }

    res.json({
      username: user.username,
      token: createToken(user),
      role: user.role,
      id: user._id,
      subject: user.subject,
      name: user.name,
      lastname: user.lastname,
    });
  } catch (error) {
    res.status(500).json({ error: "Login vaqtida server xatosi" });
  }
});

module.exports = router;
