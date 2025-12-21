/**
 * Advisor Controller
 * Handles advisor-specific operations: project and task management, student enrollment, grading
 */

const Project = require("../models/Project");
const User = require("../models/User");
const Submission = require("../models/Submission");
const Task = require("../models/Task");

/**
 * CREATE PROJECT
 * Creates a new project and automatically adds requesting advisor as creator
 * Optionally adds initial students
 *
 * @param {Object} req - Express request object
 * @param {string} req.body.name - Project name
 * @param {string} req.body.description - Project description
 * @param {Array} req.body.studentIds - Initial student IDs to enroll (optional)
 * @param {Object} res - Express response object
 */
exports.createProject = async (req, res) => {
  const { name, description, studentIds = [] } = req.body;

  try {
    // Create project with current advisor as creator
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

/**
 * ADD STUDENT TO PROJECT
 * Enrolls an existing student in a project
 * Only allows advisor assigned to project to modify it
 *
 * @param {Object} req - Express request object
 * @param {string} req.body.projectId - Project ID
 * @param {string} req.body.studentId - Student ID to add
 * @param {Object} res - Express response object
 */
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

/**
 * GET ADVISOR'S PROJECTS
 * Retrieves all projects where advisor is assigned
 * Includes student and advisor details
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
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

/**
 * DELETE PROJECT
 * Deletes project and all related data (tasks, submissions, discussions)
 * Only advisor who owns the project can delete it
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.projectId - Project ID to delete
 * @param {Object} res - Express response object
 */
exports.deleteProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Check if advisor owns this project
    if (!project.advisors.includes(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this project" });
    }

    // Delete all related data
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

/**
 * GET ALL STUDENTS
 * Retrieves list of all students for enrollment in projects
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("name email");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET PROJECT TASKS
 * Retrieves all tasks for a specific project
 * Only advisor assigned to project can view
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.projectId - Project ID
 * @param {Object} res - Express response object
 */
exports.getAdvisorProjectTasks = async (req, res) => {
  const { projectId } = req.params;
  try {
    // Verify advisor is assigned to project
    const project = await Project.findOne({
      _id: projectId,
      advisors: req.user._id,
    });
    if (!project)
      return res
        .status(403)
        .json({ message: "Not authorized for this project" });

    const tasks = await Task.find({ projectId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET TASK SUBMISSIONS
 * Retrieves all submissions for a specific task
 * Shows which students submitted and their status
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.taskId - Task ID
 * @param {Object} res - Express response object
 */
exports.getTaskSubmissions = async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await Task.findById(taskId).populate("projectId");
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Ensure advisor is in the project
    const isAdvisor = task.projectId.advisors.some(
      (a) => a.toString() === req.user._id.toString()
    );
    if (!isAdvisor) return res.status(403).json({ message: "Not authorized" });

    const submissions = await Submission.find({ taskId }).populate(
      "studentId",
      "name email"
    );
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE TASK
 * Updates task details (name, instructions)
 * Only advisor who created task can update
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.taskId - Task ID
 * @param {string} req.body.name - Updated task name
 * @param {string} req.body.instructions - Updated instructions
 * @param {Object} res - Express response object
 */
exports.updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { name, instructions } = req.body;

  try {
    const task = await Task.findById(taskId).populate("projectId");
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Check advisor authorization
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

/**
 * DELETE TASK
 * Removes a task and all its submissions
 * Only advisor who created task can delete
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.taskId - Task ID to delete
 * @param {Object} res - Express response object
 */
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

/**
 * GRADE SUBMISSION
 * Assigns marks to a student's submission
 * Updates submission status to "evaluated"
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.submissionId - Submission ID to grade
 * @param {number} req.body.marks - Marks to assign
 * @param {Object} res - Express response object
 */
exports.gradeSubmission = async (req, res) => {
  const { submissionId } = req.params;
  const { marks } = req.body;

  try {
    // Fetch submission with related task and project info
    const submission = await Submission.findById(submissionId).populate({
      path: "taskId",
      populate: { path: "projectId", select: "advisors" },
    });

    if (!submission)
      return res.status(404).json({ message: "Submission not found" });

    // Ensure advisor has access to this submission
    const isAdvisor = submission.taskId.projectId.advisors.some(
      (advisor) => advisor.toString() === req.user._id.toString()
    );
    if (!isAdvisor) return res.status(403).json({ message: "Not authorized" });

    // Update submission with marks and status
    submission.marks = marks;
    submission.status = "evaluated";
    await submission.save();

    res.json({ message: "Submission graded", submission });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * COMPLETE TASK
 * Marks a task as completed
 * Indicates all work on the task is finished
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.taskId - Task ID to complete
 * @param {Object} res - Express response object
 */
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

exports.getAdvisorProjectTasks = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await Project.findOne({
      _id: projectId,
      advisors: req.user._id,
    });
    if (!project)
      return res
        .status(403)
        .json({ message: "Not authorized for this project" });

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
    const isAdvisor = task.projectId.advisors.some(
      (a) => a.toString() === req.user._id.toString()
    );
    if (!isAdvisor) return res.status(403).json({ message: "Not authorized" });

    const submissions = await Submission.find({ taskId }).populate(
      "studentId",
      "name email"
    );
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

// Grade a submission
exports.gradeSubmission = async (req, res) => {
  const { submissionId } = req.params;
  const { marks } = req.body;

  try {
    const submission = await Submission.findById(submissionId).populate({
      path: "taskId",
      populate: { path: "projectId", select: "advisors" },
    });

    if (!submission)
      return res.status(404).json({ message: "Submission not found" });

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
