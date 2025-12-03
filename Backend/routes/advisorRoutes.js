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

const {
  createTask,
  evaluateTask,

} = require("../controllers/taskController");

// ----- Project Routes -----
router.post("/create-project", authMiddleware, advisorOnly, createProject);
router.post("/add-student", authMiddleware, advisorOnly, addStudentToProject);
router.get("/projects", authMiddleware, advisorOnly, getAdvisorProjects);
router.get("/projects/:projectId/tasks", authMiddleware, advisorOnly, getAdvisorProjectTasks);
router.delete("/projects/:projectId", authMiddleware, advisorOnly, deleteProject);

// ----- Student Routes -----
router.get("/students", authMiddleware, advisorOnly, getAllStudents);

// // ----- Task Routes -----
router.post("/create-task", authMiddleware, advisorOnly, upload.single("file"), createTask);
router.patch("/tasks/:taskId", authMiddleware, advisorOnly, updateTask);
router.delete("/tasks/:taskId", authMiddleware, advisorOnly, deleteTask);
router.post("/evaluate-task", authMiddleware, advisorOnly, evaluateTask);
router.patch("/tasks/:taskId/complete", authMiddleware, advisorOnly, completeTask);

// // ----- Submission Routes -----
router.get("/tasks/:taskId/submissions", authMiddleware, advisorOnly, getTaskSubmissions);
router.patch("/submissions/:submissionId/grade", authMiddleware, advisorOnly, gradeSubmission);

module.exports = router;
