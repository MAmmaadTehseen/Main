const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const existing = await User.findOne({ email: "admin@example.com" });
  if (!existing) {
    await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin"
    });
    console.log("Admin created.");
  } else {
    console.log("Admin already exists.");
  }

  mongoose.disconnect();
});
