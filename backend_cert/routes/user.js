const express = require("express");
const User = require("../models/User");
const requireAuth = require("../middleware/requireAuth");
const { isMongoConnected, readDb, writeDb } = require("../storage");

const router = express.Router();

router.get("/getusers", requireAuth, async (req, res) => {
  if (req.user.role !== "root") {
    return res.status(403).json({ error: "Faqat root admin ko'ra oladi" });
  }

  if (!isMongoConnected()) {
    const db = readDb();
    return res.json(db.users.map(({ password, ...user }) => user));
  }

  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

router.post("/register", requireAuth, async (req, res) => {
  if (req.user.role !== "root") {
    return res.status(403).json({ error: "Faqat root admin yaratishi mumkin" });
  }

  const username = String(req.body.username || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const name = String(req.body.name || "").trim();
  const lastname = String(req.body.lastname || "").trim();
  const number = String(req.body.number || "").trim();
  const subject = String(req.body.subject || "").trim();
  const role = req.body.role === "root" ? "root" : "admin";

  if (!username || !password) {
    return res.status(400).json({ error: "Username va password kerak" });
  }

  try {
    if (!isMongoConnected()) {
      const db = readDb();

      if (db.users.some((user) => user.username === username)) {
        return res.status(409).json({ error: "Bu username mavjud" });
      }

      const user = {
        _id: `local-user-${Date.now()}`,
        username,
        password,
        name,
        lastname,
        number,
        subject,
        role,
        permission: true,
      };
      db.users.unshift(user);
      writeDb(db);

      const { password: _password, ...safeUser } = user;
      return res.status(200).json(safeUser);
    }

    const user = await User.create({ username, password, name, lastname, number, subject, role });
    res.status(200).json({
      username: user.username,
      role: user.role,
      id: user._id,
      name: user.name,
      lastname: user.lastname,
      subject: user.subject,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "Bu username mavjud" });
    }
    res.status(500).json({ error: "User yaratishda xato" });
  }
});

router.delete("/delete/:id", requireAuth, async (req, res) => {
  if (req.user.role !== "root") {
    return res.status(403).json({ error: "Faqat root admin o'chira oladi" });
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ error: "User topilmadi" });

  res.json({ message: "User o'chirildi" });
});

module.exports = router;
