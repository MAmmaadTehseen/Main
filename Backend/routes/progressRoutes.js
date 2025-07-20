const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { getProjectProgress, getTaskProgress } = require("../controllers/progressController");

const router = express.Router();

router.get("/project/:projectId", authMiddleware, getProjectProgress);
router.get("/task/:taskId", authMiddleware, getTaskProgress);

module.exports = router;
