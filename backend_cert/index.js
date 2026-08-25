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
let mongoReady = false;
let mongoUnavailable = false;

app.use(cors());
app.use(express.json());

async function connectDb() {
  if (!process.env.DB_CONNECTION || mongoUnavailable) {
    return;
  }

  if (mongoReady || mongoose.connection.readyState === 1) {
    mongoReady = true;
    return;
  }

  try {
    await mongoose.connect(process.env.DB_CONNECTION, { serverSelectionTimeoutMS: 5000 });
    mongoReady = true;
  } catch (error) {
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
    mongoReady = false;
    mongoUnavailable = true;
    useLocalStorage();
    console.warn(`MongoDB so'rovi bajarilmadi (${error.message}). Lokal JSON rejimi davom etadi.`);
    next();
  }
});

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "backend-cert" });
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
