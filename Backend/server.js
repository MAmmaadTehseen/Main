/**
 * FYP COMPASS - Backend Server Configuration
 * Main Express server setup with MongoDB connection and API routes
 */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

// ========== MIDDLEWARE SETUP ==========
// Enable Cross-Origin Resource Sharing (CORS) - allows requests from different domains
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// ========== FILE SERVING ==========
// Serve uploaded files (submissions, tasks, etc.) with proper CORS headers
// This allows frontend to access uploaded files from different origin
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  },
  express.static(path.join(__dirname, "uploads"))
);

// ========== IMPORT ALL ROUTE HANDLERS ==========
// Each route file contains endpoints for a specific role/feature
const authRoutes = require("./routes/authRoutes"); // Authentication (login, signup, password reset)
const adminRoutes = require("./routes/adminRoutes"); // Admin functionality (user & project management)
const advisorRoutes = require("./routes/advisorRoutes"); // Advisor functionality (project & task management)
const studentRoutes = require("./routes/studentRoutes"); // Student functionality (view projects & submit tasks)
const chatbotRoutes = require("./routes/chatbotRoutes"); // AI Chatbot endpoints
const discussionRoutes = require("./routes/discussionRoutes"); // Project discussion/chat
const progressRoutes = require("./routes/progressRoutes"); // Project progress tracking

// ========== REGISTER ROUTES ==========
// Mount route handlers on specific API endpoints
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/advisor", advisorRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/progress", progressRoutes);

// ========== ERROR HANDLING ==========
// Catch any undefined routes and return 404 error
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ========== DATABASE CONNECTION & SERVER START ==========
// Connect to MongoDB and start the Express server
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
