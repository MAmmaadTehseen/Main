/**
 * Submission Model
 * Stores student submissions for tasks
 * Tracks submission file, grades, and evaluation status
 */

const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    // Reference to the task being submitted for
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },

    // Reference to the student who submitted
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // URL to the submitted file
    fileUrl: { type: String, required: true },

    // Marks/grade given by advisor (null until evaluated)
    marks: { type: Number, default: null },

    // Submission status:
    // "pending" - Task hasn't been submitted yet
    // "submitted" - Student submitted the work
    // "evaluated" - Advisor has graded the submission
    status: {
      type: String,
      enum: ["pending", "submitted", "evaluated"],
      default: "pending",
    },
  },
  { timestamps: true }
); // Automatically add createdAt and updatedAt timestamps

module.exports = mongoose.model("Submission", submissionSchema);
