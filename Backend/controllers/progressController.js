/**
 * Progress Controller
 * Tracks project and task progress metrics
 * Calculates completion percentages and statistics
 */

const Project = require("../models/Project");
const Task = require("../models/Task");
const Submission = require("../models/Submission");

/**
 * GET PROJECT PROGRESS
 * Calculates overall progress of a project
 * Shows completed tasks vs total tasks
 * Returns completion percentage
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.projectId - Project ID
 * @param {Object} res - Express response object
 */
exports.getProjectProgress = async (req, res) => {
  const { projectId } = req.params;

  try {
    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Count total and completed tasks
    const totalTasks = await Task.countDocuments({ projectId });
    const completedTasks = await Task.countDocuments({
      projectId,
      isCompleted: true,
    });

    // Calculate completion percentage
    const completionPercentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
      projectId,
      totalTasks,
      completedTasks,
      completionPercentage,
      progress: `${completionPercentage}%`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET TASK PROGRESS
 * Calculates progress of submissions for a task
 * Shows evaluated submissions vs total submissions
 * Returns evaluation completion percentage
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.taskId - Task ID
 * @param {Object} res - Express response object
 */
exports.getTaskProgress = async (req, res) => {
  const { taskId } = req.params;

  try {
    // Verify task exists
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Count total and evaluated submissions
    const totalSubmissions = await Submission.countDocuments({ taskId });
    const evaluatedSubmissions = await Submission.countDocuments({
      taskId,
      status: "evaluated",
    });

    // Calculate evaluation completion percentage
    const completionPercentage =
      totalSubmissions > 0
        ? Math.round((evaluatedSubmissions / totalSubmissions) * 100)
        : 0;

    res.json({
      taskId,
      totalSubmissions,
      evaluatedSubmissions,
      completionPercentage,
      progress: `${completionPercentage}%`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
