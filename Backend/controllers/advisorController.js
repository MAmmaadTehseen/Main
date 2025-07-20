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
  const { marks, feedback } = req.body;

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
    submission.feedback = feedback;
    submission.evaluated = true;
    await submission.save();

    res.json({ message: "Submission graded", submission });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark task as completed (when all submissions are graded)
exports.completeTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId).populate("projectId");
    if (!task) return res.status(404).json({ message: "Task not found" });

    const isAdvisor = task.projectId.advisors.includes(req.user._id);
    if (!isAdvisor) return res.status(403).json({ message: "Not authorized" });

    // Check all submissions are evaluated
    const submissions = await Submission.find({ taskId });
    const allEvaluated = submissions.every((s) => s.evaluated);

    if (!allEvaluated) {
      return res.status(400).json({ message: "Not all submissions are evaluated" });
    }

    task.status = "completed";
    await task.save();

    res.json({ message: "Task marked as completed", task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
