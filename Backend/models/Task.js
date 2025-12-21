/**
 * Task Model
 * Defines tasks that advisors create for students in a project
 * Each task has instructions and an optional file (e.g., assignment PDF)
 */

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    // Task title/name
    name: { type: String, required: true },

    // Detailed instructions for the task
    instructions: String,

    // URL to task file (e.g., assignment PDF, reference materials)
    fileUrl: String,

    // Reference to the project this task belongs to
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    // Reference to the advisor who created this task
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Flag to mark task as done (created/active)
    isDone: { type: Boolean, default: false },

    // Flag to mark task as completed (all evaluations done)
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
); // Automatically add createdAt and updatedAt timestamps

module.exports = mongoose.model("Task", taskSchema);
