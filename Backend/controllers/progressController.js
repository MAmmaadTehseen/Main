const Project = require("../models/Project");
const Task = require("../models/Task");
const Submission = require("../models/Submission");

// Project progress
exports.getProjectProgress = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const totalTasks = await Task.countDocuments({ projectId });
    const completedTasks = await Task.countDocuments({ projectId, status: "completed" });

    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    res.json({
      projectId,
      totalTasks,
      completedTasks,
      progress: `${progress.toFixed(2)}%`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Task progress (submissions)
exports.getTaskProgress = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const totalSubmissions = await Submission.countDocuments({ taskId });
    const evaluatedSubmissions = await Submission.countDocuments({ taskId, evaluated: true });

    const progress = totalSubmissions > 0 ? (evaluatedSubmissions / totalSubmissions) * 100 : 0;

    res.json({
      taskId,
      totalSubmissions,
      evaluatedSubmissions,
      progress: `${progress.toFixed(2)}%`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
