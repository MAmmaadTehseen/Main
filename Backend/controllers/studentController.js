/**
 * Student Controller
 * Handles student-specific operations: viewing projects, tasks, and submitting work
 */

const Project = require("../models/Project");
const Task = require("../models/Task");
const Submission = require("../models/Submission");

/**
 * GET STUDENT'S PROJECTS
 * Retrieves all projects the logged-in student is enrolled in
 * Includes advisor and student information for each project
 *
 * @param {Object} req - Express request object (includes authenticated user)
 * @param {Object} res - Express response object
 */
exports.getStudentProjects = async (req, res) => {
  try {
    // Find all projects where this student is in the students array
    const projects = await Project.find({ students: req.user._id })
      .populate("advisors", "name email") // Get advisor names and emails
      .populate("students", "name email"); // Get student names and emails
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET PROJECT TASKS WITH SUBMISSIONS
 * Retrieves all tasks for a specific project with the student's submission status
 * Only allows student to see tasks if they're enrolled in the project
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.projectId - ID of the project
 * @param {Object} res - Express response object
 */
exports.getStudentProjectTasks = async (req, res) => {
  const { projectId } = req.params;
  try {
    // Verify student is authorized for this project
    const project = await Project.findOne({
      _id: projectId,
      students: req.user._id,
    });
    if (!project)
      return res
        .status(403)
        .json({ message: "Not authorized for this project" });

    // Get all tasks for this project
    const tasks = await Task.find({ projectId }).lean();

    // Get student's submissions for all tasks in this project
    const submissions = await Submission.find({
      studentId: req.user._id,
      taskId: { $in: tasks.map((t) => t._id) },
    });

    // Create a map of task ID to submission for quick lookup
    const submissionMap = submissions.reduce((acc, sub) => {
      acc[sub.taskId.toString()] = sub;
      return acc;
    }, {});

    // Combine task data with submission status
    const data = tasks.map((t) => ({
      ...t,
      mySubmission: submissionMap[t._id.toString()] || null, // null if no submission yet
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET SINGLE TASK WITH SUBMISSION
 * Retrieves a specific task and the student's submission for it
 * Verifies student is authorized to view this task
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.taskId - ID of the task to retrieve
 * @param {Object} res - Express response object
 */
exports.getStudentTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    // Get task and populate project info
    const task = await Task.findById(taskId).populate("projectId");
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Verify student is enrolled in this project
    if (!task.projectId.students.some((s) => s.equals(req.user._id)))
      return res.status(403).json({ message: "Not authorized" });

    // Get student's submission for this task (if any)
    const submission = await Submission.findOne({
      taskId,
      studentId: req.user._id,
    });
    res.json({ task, mySubmission: submission || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * EDIT/UPDATE SUBMISSION
 * Updates an existing submission with a new file
 * Only allows student to edit their own submissions
 * Updates the 'updatedAt' timestamp
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.submissionId - ID of the submission to update
 * @param {string} req.body.fileUrl - URL/path of the new file to submit
 * @param {Object} res - Express response object
 */
exports.editSubmission = async (req, res) => {
  const { submissionId } = req.params;
  const { fileUrl } = req.body;

  try {
    const submission = await Submission.findById(submissionId);
    if (!submission)
      return res.status(404).json({ message: "Submission not found" });

    // Verify student owns this submission
    if (submission.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update file URL if provided
    if (fileUrl) submission.fileUrl = fileUrl;
    submission.updatedAt = Date.now();

    await submission.save();
    res.json({ message: "Submission updated", submission });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
