/**
 * Progress Routes
 * Defines endpoints for tracking project and task progress
 * Users can retrieve progress metrics and completion statistics
 */

const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  getProjectProgress,
  getTaskProgress,
} = require("../controllers/progressController");

const router = express.Router();

/**
 * GET /api/progress/project/:projectId
 * Get overall progress for a project
 * Protected Route - Authenticated users only
 * Params: projectId
 * Returns: { completedTasks, totalTasks, progressPercentage }
 * Calculates the percentage of tasks completed in the project
 */
router.get("/project/:projectId", authMiddleware, getProjectProgress);

/**
 * GET /api/progress/task/:taskId
 * Get progress for a specific task
 * Protected Route - Authenticated users only
 * Params: taskId
 * Returns: { evaluatedSubmissions, totalSubmissions, progressPercentage }
 * Calculates the percentage of submissions that have been graded
 */
router.get("/task/:taskId", authMiddleware, getTaskProgress);

module.exports = router;
