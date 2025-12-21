/**
 * Task Controller
 * Handles task creation and evaluation
 * Tasks are assignments that students submit work for
 */

const Task = require("../models/Task");
const Project = require("../models/Project");
const Submission = require("../models/Submission");

/**
 * CREATE TASK
 * Creates a new task for a project
 * Only advisors assigned to the project can create tasks
 * Optionally accepts file attachment (e.g., assignment PDF)
 *
 * @param {Object} req - Express request object
 * @param {string} req.body.name - Task name
 * @param {string} req.body.instructions - Task instructions/description
 * @param {string} req.body.projectId - Project ID
 * @param {Object} req.file - Optional uploaded file (from middleware)
 * @param {Object} res - Express response object
 */
const createTask = async (req, res) => {
  const { name, instructions, projectId } = req.body;

  try {
    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Only advisors on this project can create tasks
    if (!project.advisors.includes(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Only advisors on this project can create tasks" });
    }

    // Build task data object
    const taskData = {
      name,
      instructions,
      projectId,
      createdBy: req.user._id,
    };

    // Attach file if provided
    if (req.file) {
      taskData.fileUrl = "/" + req.file.path.replace(/\\/g, "/");
    }

    // Create the task
    const task = await Task.create(taskData);

    res.status(201).json({ message: "Task created", task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * EVALUATE TASK
 * Grades a student's submission for a task
 * Updates submission status to "evaluated"
 * If all submissions are evaluated, marks task as complete
 *
 * @param {Object} req - Express request object
 * @param {string} req.body.taskId - Task ID
 * @param {string} req.body.studentId - Student ID
 * @param {number} req.body.marks - Marks to assign
 * @param {Object} res - Express response object
 */
const evaluateTask = async (req, res) => {
  const { taskId, studentId, marks } = req.body;

  try {
    // Find the submission
    const submission = await Submission.findOne({ taskId, studentId });
    if (!submission)
      return res.status(404).json({ message: "Submission not found" });

    // Update submission with marks and evaluated status
    submission.marks = marks;
    submission.status = "evaluated";
    await submission.save();

    // Check if all submissions for this task are now evaluated
    const allSubmissions = await Submission.find({ taskId });
    const allEvaluated = allSubmissions.every((s) => s.status === "evaluated");

    // If all evaluated, mark task as complete
    if (allEvaluated) {
      await Task.findByIdAndUpdate(taskId, { isDone: true, isCompleted: true });
    }

    res.json({ message: "Submission evaluated", submission });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createTask,
  evaluateTask,
};
