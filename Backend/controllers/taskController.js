const Task = require("../models/Task");
const Project = require("../models/Project");
const Submission = require("../models/Submission");

// Create task
const createTask = async (req, res) => {
  const { name, instructions, projectId } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Only advisors on this project can create tasks
    if (!project.advisors.includes(req.user._id)) {
      return res.status(403).json({ message: "Only advisors on this project can create tasks" });
    }

    const taskData = {
      name,
      instructions,
      projectId,
      createdBy: req.user._id,
    };

    // File is optional
    if (req.file) {
      taskData.fileUrl = req.file.path;
    }

    const task = await Task.create(taskData);

    res.status(201).json({ message: "Task created", task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Evaluate task submission
const evaluateTask = async (req, res) => {
  const { taskId, studentId, marks } = req.body;

  try {
    const submission = await Submission.findOne({ taskId, studentId });
    if (!submission) return res.status(404).json({ message: "Submission not found" });

    submission.marks = marks;
    submission.status = "evaluated";
    await submission.save();

    // Check if all submissions are evaluated
    const allSubmissions = await Submission.find({ taskId });
    const allEvaluated = allSubmissions.every((s) => s.status === "evaluated");

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
  // Add other exports like getTaskSubmissions, updateTask, etc.
};
