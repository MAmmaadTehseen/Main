/**
 * Chatbot Routes
 * Defines endpoints for AI chatbot interaction
 * Users can ask questions and receive responses from the chatbot
 */

const express = require("express");
const router = express.Router();
const { getResponse } = require("../controllers/chatbotController");

/**
 * POST /api/chatbot/ask
 * Submit a question to the chatbot and receive a response
 * Public endpoint - No authentication required
 * Body: { question }
 * Returns: { response } - AI-generated response from knowledge base
 */
router.post("/ask", getResponse);

module.exports = router;
