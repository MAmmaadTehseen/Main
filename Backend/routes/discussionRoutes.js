/**
 * Discussion Routes
 * Defines endpoints for project-based discussion and messaging
 * Users can retrieve and post messages within project discussions
 */

const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  getProjectMessages,
  postMessage,
} = require("../controllers/discussionController");

// ===== MESSAGE ROUTES =====

/**
 * GET /api/discussion/:projectId
 * Retrieve all messages for a specific project discussion
 * Protected Route - Authenticated users only
 * Params: projectId
 * Returns: Array of message objects with user and timestamp info
 */
router.get("/:projectId", authMiddleware, getProjectMessages);

/**
 * POST /api/discussion/:projectId
 * Post a new message to project discussion
 * Protected Route - Authenticated users only
 * Params: projectId
 * Body: { content }
 * Returns: Created message object
 */
router.post("/:projectId", authMiddleware, postMessage);

module.exports = router;
