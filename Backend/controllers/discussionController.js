/**
 * Discussion Controller
 * Manages project discussion/chat functionality
 * Handles retrieving and posting messages within projects
 */

const Discussion = require("../models/Discussion");

/**
 * GET PROJECT MESSAGES
 * Retrieves all messages for a specific project
 * Messages are sorted chronologically (oldest first)
 * Includes sender information (name and role)
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.projectId - ID of the project
 * @param {Object} res - Express response object
 */
exports.getProjectMessages = async (req, res) => {
  const { projectId } = req.params;
  try {
    // Find all messages for this project and populate sender info
    const messages = await Discussion.find({ projectId })
      .populate("sender", "name role")
      .sort({ createdAt: 1 }); // Sort by creation time (oldest first)
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST MESSAGE
 * Creates a new message in project discussion
 * Validates that message is not empty
 * Automatically assigns current user as sender
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.projectId - ID of the project
 * @param {string} req.body.message - Message content
 * @param {Object} res - Express response object
 */
exports.postMessage = async (req, res) => {
  const { projectId } = req.params;
  const { message } = req.body;

  try {
    // Validate message is not empty
    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    // Create new discussion message
    const newMessage = await Discussion.create({
      projectId,
      sender: req.user._id,
      message,
    });

    // Populate sender info and return
    const populatedMessage = await newMessage.populate("sender", "name role");

    res.status(201).json(populatedMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
