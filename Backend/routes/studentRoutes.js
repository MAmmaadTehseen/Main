/**
 * Student Routes
 * Defines endpoints for student-specific operations
 * All routes require authentication and student role verification
 */

const express = require("express");
const router = express.Router();
const { authMiddleware, studentOnly } = require("../middleware/authMiddleware");
const { uploadSubmission } = require("../middleware/upload");
const { submitTask } = require("../controllers/submissionController");
const {
  getStudentProjects,
  getStudentProjectTasks,
  getStudentTask,
  editSubmission,
} = require("../controllers/studentController");

/**
 * POST /api/student/submit-task
 * Submit a task/assignment with optional file upload
 * Protected Route - Student only
 * Body: { taskId, submissionText, file (optional) }
 * Returns: Submission object with file path
 */
router.post(
  "/submit-task",
  authMiddleware,
  studentOnly,
  uploadSubmission.single("file"),
  submitTask
);

/**
 * GET /api/student/projects
 * Retrieve all projects student is enrolled in
 * Protected Route - Student only
 * Returns: Array of project objects
 */
router.get("/projects", authMiddleware, studentOnly, getStudentProjects);

/**
 * GET /api/student/projects/:projectId/tasks
 * Get all tasks for a specific project
 * Protected Route - Student only
 * Params: projectId
 * Returns: Array of task objects for the project
 */
router.get(
  "/projects/:projectId/tasks",
  authMiddleware,
  studentOnly,
  getStudentProjectTasks
);

/**
 * GET /api/student/tasks/:taskId
 * Get detailed information about a specific task
 * Protected Route - Student only
 * Params: taskId
 * Returns: Task object with description, due date, and submission status
 */
router.get("/tasks/:taskId", authMiddleware, studentOnly, getStudentTask);

/**
 * PATCH /api/student/submissions/:submissionId
 * Update an existing submission (resubmit)
 * Protected Route - Student only
 * Note: Currently commented out - edit submission feature
 */
// router.patch("/submissions/:submissionId", authMiddleware, studentOnly, editSubmission);

module.exports = router;
