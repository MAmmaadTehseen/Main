const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// // Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const advisorRoutes = require("./routes/advisorRoutes");
const studentRoutes = require("./routes/studentRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const discussionRoutes = require("./routes/discussionRoutes");
const progressRoutes = require("./routes/progressRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/advisor", advisorRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/progress", progressRoutes);

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Database Connection & Server Start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
