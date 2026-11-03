const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const { useLocalStorage } = require("./storage");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const certificateRoutes = require("./routes/certificate");

const app = express();
const port = process.env.PORT || 5000;
const isVercel = Boolean(process.env.VERCEL);
let mongoReady = false;
let mongoUnavailable = false;
let connectPromise = null;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "backend-cert" });
});

// Ulanish o'rnatilguncha (yoki uzilgan ulanish tiklanguncha) kutadi
function waitUntilConnected(timeoutMs) {
  return new Promise((resolve) => {
    const startedAt = Date.now();
    const timer = setInterval(() => {
      const connected = mongoose.connection.readyState === 1;

      if (connected || Date.now() - startedAt >= timeoutMs) {
        clearInterval(timer);
        resolve(connected);
      }
    }, 100);
  });
}

async function openConnection() {
  const state = mongoose.connection.readyState;

  // 2 - ulanmoqda, 0 - uzilgan (cold start yoki "uyqu"dan keyin driver o'zi qayta ulanadi):
  // mongoose.connect() ulanish jarayonida kutmasdan qaytadi, shuning uchun avval o'zimiz kutamiz
  if (state === 2 || (state === 0 && mongoReady)) {
    if (await waitUntilConnected(state === 2 ? 8000 : 3000)) {
      return;
    }
  }

  await mongoose.connect(process.env.DB_CONNECTION, { serverSelectionTimeoutMS: 5000 });

  if (mongoose.connection.readyState !== 1) {
    throw new Error("MongoDB ulanishi tayyor emas");
  }
}

async function connectDb() {
  if (!process.env.DB_CONNECTION || mongoUnavailable) {
    return;
  }

  if (mongoose.connection.readyState === 1) {
    mongoReady = true;
    return;
  }

  if (!connectPromise) {
    connectPromise = openConnection().finally(() => {
      connectPromise = null;
    });
  }

  try {
    await connectPromise;
    mongoReady = true;
  } catch (error) {
    if (isVercel) {
      // Vercel'da fayl tizimi faqat o'qish uchun: lokal JSON rejimi ishlamaydi, keyingi so'rov qayta urinadi
      throw error;
    }

    mongoReady = false;
    mongoUnavailable = true;
    useLocalStorage();
    console.warn(`MongoDB ulanmagan (${error.message}). Lokal JSON rejimiga o'tildi.`);
  }
}

app.use(async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (error) {
    if (isVercel) {
      console.error(`MongoDB ulanmagan (${error.message}).`);
      return res.status(503).json({ error: "Ma'lumotlar bazasi bilan aloqa yo'q, birozdan keyin qayta urinib ko'ring" });
    }

    mongoReady = false;
    mongoUnavailable = true;
    useLocalStorage();
    console.warn(`MongoDB so'rovi bajarilmadi (${error.message}). Lokal JSON rejimi davom etadi.`);
    next();
  }
});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/certificate", certificateRoutes);

if (require.main === module) {
  connectDb()
    .then(() => {
      if (mongoReady) {
        console.log("MongoDB connected");
      } else {
        console.warn("Backend lokal JSON rejimida ishlaydi.");
      }
      app.listen(port, () => {
        console.log(`Server running: http://localhost:${port}`);
      });
    })
    .catch((error) => {
      console.error("Backend ishga tushirish xatosi:", error.message);
      process.exit(1);
    });
}

module.exports = app;
