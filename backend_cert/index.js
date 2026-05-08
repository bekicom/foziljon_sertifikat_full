const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const certificateRoutes = require("./routes/certificate");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "backend-cert" });
});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/certificate", certificateRoutes);

async function start() {
  if (!process.env.DB_CONNECTION) {
    console.warn("DB_CONNECTION topilmadi. Backend lokal JSON rejimida ishlaydi.");
    app.listen(port, () => {
      console.log(`Server running: http://localhost:${port}`);
    });
    return;
  }

  try {
    await mongoose.connect(process.env.DB_CONNECTION);
    console.log("MongoDB connected");
    app.listen(port, () => {
      console.log(`Server running: http://localhost:${port}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
}

start();
