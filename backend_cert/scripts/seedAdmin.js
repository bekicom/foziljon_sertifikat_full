const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../models/User");

async function seedAdmin() {
  if (!process.env.DB_CONNECTION) {
    console.error("DB_CONNECTION .env faylida ko'rsatilmagan");
    process.exit(1);
  }

  await mongoose.connect(process.env.DB_CONNECTION);

  const username = (process.env.ADMIN_USERNAME || "admin").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "0000";

  const existing = await User.findOne({ username });
  if (existing) {
    existing.password = password;
    existing.role = "root";
    existing.permission = true;
    await existing.save();
    console.log(`Root admin yangilandi: ${username}`);
  } else {
    await User.create({
      username,
      password,
      role: "root",
      name: "Root",
      lastname: "Admin",
      number: "",
      subject: "root",
      permission: true,
    });
    console.log(`Root admin yaratildi: ${username}`);
  }

  await mongoose.disconnect();
}

seedAdmin().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
