const Project = require("../models/Project");
const Task = require("../models/Task");
const Submission = require("../models/Submission");

// Get student's projects
exports.getStudentProjects = async (req, res) => {
  try {
    const projects = await Project.find({ students: req.user._id })
      .populate("advisors", "name email")
      .populate("students", "name email");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get tasks for a project
exports.getStudentProjectTasks = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await Project.findOne({ _id: projectId, students: req.user._id });
    if (!project) return res.status(403).json({ message: "Not authorized for this project" });

    const tasks = await Task.find({ projectId }).lean();
    const submissions = await Submission.find({
      studentId: req.user._id,
      taskId: { $in: tasks.map(t => t._id) }
    });

    const submissionMap = submissions.reduce((acc, sub) => {
      acc[sub.taskId.toString()] = sub;
      return acc;
    }, {});

    const data = tasks.map(t => ({
      ...t,
      mySubmission: submissionMap[t._id.toString()] || null
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single task with submission
// Get single task with submission
exports.getStudentTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await Task.findById(taskId).populate("projectId");
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!task.projectId.students.some((s) => s.equals(req.user._id)))
      return res.status(403).json({ message: "Not authorized" });

    const submission = await Submission.findOne({ taskId, studentId: req.user._id });
    res.json({ task, mySubmission: submission || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Edit submission (replace file)
exports.editSubmission = async (req, res) => {
  const { submissionId } = req.params;
  const { fileUrl } = req.body;

  try {
    const submission = await Submission.findById(submissionId);
    if (!submission) return res.status(404).json({ message: "Submission not found" });

    if (submission.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (fileUrl) submission.fileUrl = fileUrl;
    submission.updatedAt = Date.now();

    await submission.save();
    res.json({ message: "Submission updated", submission });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
