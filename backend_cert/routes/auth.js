const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { isMongoConnected, useLocalStorage, readDb } = require("../storage");

const router = express.Router();

function createToken(user, local = false) {
  return jwt.sign(
    { id: user._id, role: user.role, local },
    process.env.JWT_SECRET || "local-dev-secret",
    { expiresIn: "7d" }
  );
}

function loginFromLocalStorage(username, password, res) {
  const db = readDb();
  const user = db.users.find(
    (item) => item.username === username && item.password === password && item.permission
  );

  if (!user) {
    return res.status(400).json({ error: "Login yoki parol noto'g'ri" });
  }

  return res.json({
    username: user.username,
    token: createToken(user, true),
    role: user.role,
    id: user._id,
    subject: user.subject,
    name: user.name,
    lastname: user.lastname,
  });
}

router.post("/login", async (req, res) => {
  const username = String(req.body.username || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!username || !password) {
    return res.status(400).json({ error: "Login va parol kerak" });
  }

  const localUserExists = readDb().users.some(
    (item) => item.username === username && item.password === password && item.permission
  );

  if (localUserExists) {
    useLocalStorage();
    return loginFromLocalStorage(username, password, res);
  }

  try {
    if (!isMongoConnected()) {
      return loginFromLocalStorage(username, password, res);
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
    console.warn(`MongoDB login xatosi (${error.message}). Lokal login ishlatiladi.`);
    useLocalStorage();
    return loginFromLocalStorage(username, password, res);
  }
});

module.exports = router;
