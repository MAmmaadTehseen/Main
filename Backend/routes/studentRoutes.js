const express = require("express");
const router = express.Router();
const { authMiddleware, studentOnly } = require("../middleware/authMiddleware");
const { uploadSubmission } = require("../middleware/upload");
const { submitTask } = require("../controllers/submissionController");
const { getStudentProjects, getStudentProjectTasks, getStudentTask, editSubmission } = require("../controllers/studentController");

router.post("/submit-task", authMiddleware, studentOnly, uploadSubmission.single("file"), submitTask);


router.get("/projects", authMiddleware, studentOnly, getStudentProjects);
router.get("/projects/:projectId/tasks", authMiddleware, studentOnly, getStudentProjectTasks);
router.get("/tasks/:taskId", authMiddleware, studentOnly, getStudentTask);


// router.patch("/submissions/:submissionId", authMiddleware, studentOnly, editSubmission);

module.exports = router;
