/**
 * User Model
 * Defines the database schema for user accounts
 * Stores user credentials and role information
 */

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // User's full name
    name: { type: String, required: true },

    // User's email - must be unique across all users
    email: { type: String, required: true, unique: true },

    // Hashed password (never stored in plain text)
    password: { type: String, required: true },

    // User's role determines their access level and permissions
    // admin: Full system access, manage users and projects
    // advisor: Can create projects, assign students, grade submissions
    // student: Can view projects and submit task files
    role: {
      type: String,
      enum: ["admin", "advisor", "student"],
      required: true,
    },
  },
  { timestamps: true }
); // Automatically add createdAt and updatedAt timestamps

module.exports = mongoose.model("User", userSchema);
