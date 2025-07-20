const express = require("express");
const router = express.Router();
const { getResponse } = require("../controllers/chatbotController");

router.post("/ask", getResponse);

module.exports = router;

