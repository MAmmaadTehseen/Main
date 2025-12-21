/**
 * Discussion Model
 * Stores messages in project discussions/chats
 * Allows advisors and students to communicate within a project
 */

const mongoose = require("mongoose");

const discussionSchema = new mongoose.Schema(
  {
    // Reference to the project this discussion belongs to
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    // Reference to the user who sent the message
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The message content
    message: { type: String, required: true },
  },
  { timestamps: true }
); // Automatically add createdAt and updatedAt timestamps

module.exports = mongoose.model("Discussion", discussionSchema);
