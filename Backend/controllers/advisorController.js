const Project = require("../models/Project");
const User = require("../models/User");

// Create new project (advisor must be creator)
exports.createProject = async (req, res) => {
  const { name, description, studentIds = [] } = req.body;

  try {
    const project = await Project.create({
      name,
      description,
      advisors: [req.user._id], // Automatically add the creator as advisor
      students: studentIds,
    });

    res.status(201).json({ message: "Project created", project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Add student to an existing project
exports.addStudentToProject = async (req, res) => {
  const { projectId, studentId } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Only allow advisor assigned to project to modify it
    if (!project.advisors.includes(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Add student if not already present
    if (!project.students.includes(studentId)) {
      project.students.push(studentId);
      await project.save();
    }

    res.json({ message: "Student added to project", project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAdvisorProjects = async (req, res) => {
  try {
    const projects = await Project.find({ advisors: req.user._id })
      .populate("students", "name email")
      .populate("advisors", "name email");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete project (only advisor who owns the project)
exports.deleteProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Check if advisor owns this project
    if (!project.advisors.includes(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to delete this project" });
    }

    // Delete all tasks and submissions related to this project
    const Task = require("../models/Task");
    const Submission = require("../models/Submission");
    const Discussion = require("../models/Discussion");

    const tasks = await Task.find({ projectId });
    for (const task of tasks) {
      await Submission.deleteMany({ taskId: task._id });
    }
    await Task.deleteMany({ projectId });
    await Discussion.deleteMany({ projectId });

    // Delete the project
    await Project.findByIdAndDelete(projectId);

    res.json({ message: "Project and all related data deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all students for advisor to add to projects
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("name email");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getAdvisorProjectTasks = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await Project.findOne({ _id: projectId, advisors: req.user._id });
    if (!project) return res.status(403).json({ message: "Not authorized for this project" });

    const tasks = await Task.find({ projectId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getTaskSubmissions = async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await Task.findById(taskId).populate("projectId");
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Ensure advisor is in the project
    const isAdvisor = task.projectId.advisors.some(a => a.toString() === req.user._id.toString());
    if (!isAdvisor) return res.status(403).json({ message: "Not authorized" });

    const submissions = await Submission.find({ taskId }).populate("studentId", "name email");
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Update task
exports.updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { name, instructions } = req.body;

  try {
    const task = await Task.findById(taskId).populate("projectId");
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Check advisor
    const isAdvisor = task.projectId.advisors.includes(req.user._id);
    if (!isAdvisor) return res.status(403).json({ message: "Not authorized" });

    if (name) task.name = name;
    if (instructions) task.instructions = instructions;

    await task.save();
    res.json({ message: "Task updated", task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await Task.findById(taskId).populate("projectId");
    if (!task) return res.status(404).json({ message: "Task not found" });

    const isAdvisor = task.projectId.advisors.includes(req.user._id);
    if (!isAdvisor) return res.status(403).json({ message: "Not authorized" });

    await Task.findByIdAndDelete(taskId);
    await Submission.deleteMany({ taskId }); // Clean up submissions
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const Submission = require("../models/Submission");
const Task = require("../models/Task");

// Grade a submission
exports.gradeSubmission = async (req, res) => {
  const { submissionId } = req.params;
  const { marks } = req.body;

  try {
    const submission = await Submission.findById(submissionId).populate({
      path: "taskId",
      populate: { path: "projectId", select: "advisors" },
    });

    if (!submission) return res.status(404).json({ message: "Submission not found" });

    // Ensure advisor has access to this submission
    const isAdvisor = submission.taskId.projectId.advisors.some(
      (advisor) => advisor.toString() === req.user._id.toString()
    );
    if (!isAdvisor) return res.status(403).json({ message: "Not authorized" });

    submission.marks = marks;
    submission.status = "evaluated";
    await submission.save();

    res.json({ message: "Submission graded", submission });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark task as completed
exports.completeTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId).populate("projectId");
    if (!task) return res.status(404).json({ message: "Task not found" });

    const isAdvisor = task.projectId.advisors.includes(req.user._id);
    if (!isAdvisor) return res.status(403).json({ message: "Not authorized" });

    task.isCompleted = true;
    await task.save();

    res.json({ message: "Task marked as completed", task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
