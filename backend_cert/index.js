const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const certificateRoutes = require("./routes/certificate");

const app = express();
const port = process.env.PORT || 5000;
let mongoReady = false;

app.use(cors());
app.use(express.json());

async function connectDb() {
  if (!process.env.DB_CONNECTION) {
    return;
  }

  if (mongoReady || mongoose.connection.readyState === 1) {
    mongoReady = true;
    return;
  }

  await mongoose.connect(process.env.DB_CONNECTION);
  mongoReady = true;
}

app.use(async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    res.status(500).json({ error: "Database connection error" });
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
      if (process.env.DB_CONNECTION) {
        console.log("MongoDB connected");
      } else {
        console.warn("DB_CONNECTION topilmadi. Backend lokal JSON rejimida ishlaydi.");
      }
      app.listen(port, () => {
        console.log(`Server running: http://localhost:${port}`);
      });
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error.message);
      process.exit(1);
    });
}

module.exports = app;
