/**
 * Project Model
 * Defines the database schema for FYP projects
 * Links advisors and students to projects
 */

const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    // Project name/title
    name: { type: String, required: true },

    // Detailed description of the project
    description: String,

    // Array of advisor IDs assigned to this project
    // Advisors can create tasks, grade submissions, and manage the project
    advisors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Array of student IDs enrolled in this project
    // Students can view tasks and submit work
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
); // Automatically add createdAt and updatedAt timestamps

module.exports = mongoose.model("Project", projectSchema);
