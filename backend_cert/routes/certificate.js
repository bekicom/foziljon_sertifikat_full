const express = require("express");
const Certificate = require("../models/Certificate");
const requireAuth = require("../middleware/requireAuth");
const { isMongoConnected, readDb, writeDb } = require("../storage");

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  const payload = {
    id: String(req.body.id || "").trim(),
    firstname: String(req.body.firstname || "").trim(),
    lastname: String(req.body.lastname || "").trim(),
    other: String(req.body.other || "").trim(),
    courseName: req.body.courseName,
    givenDate: String(req.body.givenDate || "").trim(),
    prosent: req.body.prosent === "" || req.body.prosent == null ? null : Number(req.body.prosent),
  };

  if (!payload.id || !payload.firstname || !payload.courseName || !payload.givenDate) {
    return res.status(400).json({ error: "Majburiy maydonlar to'ldirilmagan" });
  }

  try {
    if (!isMongoConnected()) {
      const db = readDb();

      if (db.certificates.some((certificate) => certificate.id === payload.id)) {
        return res.status(409).json({ error: "Bu ID bilan sertifikat mavjud" });
      }

      const certificate = {
        ...payload,
        _id: `local-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.certificates.unshift(certificate);
      writeDb(db);
      return res.status(201).json(certificate);
    }

    const certificate = await Certificate.create(payload);
    res.status(201).json(certificate);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "Bu ID bilan sertifikat mavjud" });
    }
    res.status(500).json({ error: "Sertifikat yaratishda xato" });
  }
});

router.get("/check/:id", async (req, res) => {
  try {
    if (!isMongoConnected()) {
      const db = readDb();
      const certificate = db.certificates.find((item) => item.id === req.params.id.trim());
      if (!certificate) return res.status(404).json({ error: "Sertifikat topilmadi" });

      return res.json(certificate);
    }

    const certificate = await Certificate.findOne({ id: req.params.id.trim() });
    if (!certificate) return res.status(404).json({ error: "Sertifikat topilmadi" });

    res.json(certificate);
  } catch (error) {
    res.status(500).json({ error: "Sertifikatni olishda xato" });
  }
});

router.get("/all", requireAuth, async (req, res) => {
  try {
    if (!isMongoConnected()) {
      const db = readDb();
      return res.json(db.certificates);
    }

    const certificates = await Certificate.find().sort({ createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ error: "Sertifikatlar ro'yxatini olishda xato" });
  }
});

router.delete("/delete/:id", requireAuth, async (req, res) => {
  try {
    if (!isMongoConnected()) {
      const db = readDb();
      const nextCertificates = db.certificates.filter((item) => item._id !== req.params.id);

      if (nextCertificates.length === db.certificates.length) {
        return res.status(404).json({ error: "Sertifikat topilmadi" });
      }

      db.certificates = nextCertificates;
      writeDb(db);
      return res.json({ message: "Sertifikat o'chirildi" });
    }

    const certificate = await Certificate.findByIdAndDelete(req.params.id);
    if (!certificate) return res.status(404).json({ error: "Sertifikat topilmadi" });

    res.json({ message: "Sertifikat o'chirildi" });
  } catch (error) {
    res.status(500).json({ error: "Sertifikatni o'chirishda xato" });
  }
});

module.exports = router;
