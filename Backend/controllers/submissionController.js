const Submission = require("../models/Submission");
const Task = require("../models/Task");

// Submit a file for a task
exports.submitTask = async (req, res) => {
  const { taskId } = req.body;

  if (!req.file) return res.status(400).json({ message: "File is required" });

  try {
    // Verify task exists and student belongs to project
    const task = await Task.findById(taskId).populate("projectId");
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!task.projectId.students.some((s) => s.equals(req.user._id))) {
      return res.status(403).json({ message: "Not authorized for this task" });
    }

    // Check for existing submission
    let submission = await Submission.findOne({ taskId, studentId: req.user._id });
    if (submission) {
      submission.fileUrl = req.file.path;
      submission.status = "submitted";
      submission.updatedAt = Date.now();
      await submission.save();
      return res.json({ message: "Submission updated", submission });
    }

    // Create a new submission
    submission = await Submission.create({
      taskId,
      studentId: req.user._id,
      fileUrl: req.file.path,
      status: "submitted",
    });

    res.status(201).json({ message: "Submission created", submission });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
