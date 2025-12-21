/**
 * Advisor Routes
 * Defines endpoints for advisor-specific operations
 * All routes require authentication and advisor role verification
 * Advisors can manage projects, tasks, students, and grade submissions
 */

const express = require("express");
const router = express.Router();
const { authMiddleware, advisorOnly } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/upload");

const {
  createProject,
  addStudentToProject,
  getAdvisorProjects,
  getAdvisorProjectTasks,
  getTaskSubmissions,
  gradeSubmission,
  completeTask,
  updateTask,
  deleteTask,
  deleteProject,
  getAllStudents,
} = require("../controllers/advisorController");

const { createTask, evaluateTask } = require("../controllers/taskController");

// ===== PROJECT MANAGEMENT ROUTES =====

/**
 * POST /api/advisor/create-project
 * Create a new FYP project
 * Protected Route - Advisor only
 * Body: { title, description, startDate, endDate }
 * Returns: Created project object
 */
router.post("/create-project", authMiddleware, advisorOnly, createProject);

/**
 * POST /api/advisor/add-student
 * Enroll a student in a project
 * Protected Route - Advisor only
 * Body: { projectId, studentId }
 * Returns: Updated project with enrolled student
 */
router.post("/add-student", authMiddleware, advisorOnly, addStudentToProject);

/**
 * GET /api/advisor/projects
 * Retrieve all projects assigned to this advisor
 * Protected Route - Advisor only
 * Returns: Array of advisor's project objects
 */
router.get("/projects", authMiddleware, advisorOnly, getAdvisorProjects);

/**
 * DELETE /api/advisor/projects/:projectId
 * Delete a project permanently
 * Protected Route - Advisor only
 * Params: projectId
 * Returns: Success message
 */
router.delete(
  "/projects/:projectId",
  authMiddleware,
  advisorOnly,
  deleteProject
);

// ===== STUDENT MANAGEMENT ROUTES =====

/**
 * GET /api/advisor/students
 * Get list of all students in the system (for enrollment)
 * Protected Route - Advisor only
 * Returns: Array of all student objects
 */
router.get("/students", authMiddleware, advisorOnly, getAllStudents);

// ===== TASK MANAGEMENT ROUTES =====

/**
 * GET /api/advisor/projects/:projectId/tasks
 * Get all tasks for a specific project
 * Protected Route - Advisor only
 * Params: projectId
 * Returns: Array of task objects for the project
 */
router.get(
  "/projects/:projectId/tasks",
  authMiddleware,
  advisorOnly,
  getAdvisorProjectTasks
);

/**
 * POST /api/advisor/create-task
 * Create a new task/assignment for a project
 * Protected Route - Advisor only
 * File upload support for task attachments
 * Body: { projectId, title, description, dueDate, file (optional) }
 * Returns: Created task object
 */
router.post(
  "/create-task",
  authMiddleware,
  advisorOnly,
  upload.single("file"),
  createTask
);

/**
 * PATCH /api/advisor/tasks/:taskId
 * Update task details (title, description, due date, etc)
 * Protected Route - Advisor only
 * Params: taskId
 * Body: Fields to update
 * Returns: Updated task object
 */
router.patch("/tasks/:taskId", authMiddleware, advisorOnly, updateTask);

/**
 * DELETE /api/advisor/tasks/:taskId
 * Delete a task from a project
 * Protected Route - Advisor only
 * Params: taskId
 * Returns: Success message
 */
router.delete("/tasks/:taskId", authMiddleware, advisorOnly, deleteTask);

/**
 * POST /api/advisor/evaluate-task
 * Evaluate/check task submissions and mark as evaluated
 * Protected Route - Advisor only
 * Body: { taskId, evaluationNotes }
 * Returns: Task status update
 */
router.post("/evaluate-task", authMiddleware, advisorOnly, evaluateTask);

/**
 * PATCH /api/advisor/tasks/:taskId/complete
 * Mark a task as complete
 * Protected Route - Advisor only
 * Params: taskId
 * Returns: Updated task with completed status
 */
router.patch(
  "/tasks/:taskId/complete",
  authMiddleware,
  advisorOnly,
  completeTask
);

// ===== SUBMISSION GRADING ROUTES =====

/**
 * GET /api/advisor/tasks/:taskId/submissions
 * Get all submissions for a specific task
 * Protected Route - Advisor only
 * Params: taskId
 * Returns: Array of submission objects with student details
 */
router.get(
  "/tasks/:taskId/submissions",
  authMiddleware,
  advisorOnly,
  getTaskSubmissions
);

/**
 * PATCH /api/advisor/submissions/:submissionId/grade
 * Grade a student's submission
 * Protected Route - Advisor only
 * Params: submissionId
 * Body: { grade, feedback }
 * Returns: Updated submission with grade and feedback
 */
router.patch(
  "/submissions/:submissionId/grade",
  authMiddleware,
  advisorOnly,
  gradeSubmission
);

module.exports = router;
