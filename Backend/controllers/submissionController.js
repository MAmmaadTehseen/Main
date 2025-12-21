/**
 * Submission Controller
 * Handles student task submissions
 * Manages file uploads for assignments
 */

const Submission = require("../models/Submission");
const Task = require("../models/Task");

/**
 * SUBMIT TASK
 * Creates or updates a student's task submission
 * Handles file upload and sets submission status
 * Only allows students enrolled in the project to submit
 *
 * @param {Object} req - Express request object
 * @param {string} req.body.taskId - Task ID being submitted for
 * @param {Object} req.file - Uploaded file (from middleware)
 * @param {Object} res - Express response object
 */
exports.submitTask = async (req, res) => {
  const { taskId } = req.body;

  // File is required for submission
  if (!req.file) return res.status(400).json({ message: "File is required" });

  try {
    // Verify task exists and fetch project info
    const task = await Task.findById(taskId).populate("projectId");
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Verify student is enrolled in the project
    if (!task.projectId.students.some((s) => s.equals(req.user._id))) {
      return res.status(403).json({ message: "Not authorized for this task" });
    }

    // Normalize file path to use forward slashes and prepend /
    const fileUrl = "/" + req.file.path.replace(/\\/g, "/");

    // Check for existing submission (student might be resubmitting)
    let submission = await Submission.findOne({
      taskId,
      studentId: req.user._id,
    });
    if (submission) {
      // Update existing submission with new file
      submission.fileUrl = fileUrl;
      submission.status = "submitted";
      submission.updatedAt = Date.now();
      await submission.save();
      return res.json({ message: "Submission updated", submission });
    }

    // Create a new submission if this is first time
    submission = await Submission.create({
      taskId,
      studentId: req.user._id,
      fileUrl: fileUrl,
      status: "submitted",
    });

    res.status(201).json({ message: "Submission created", submission });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
