/**
 * Admin Controller
 * Handles system-wide administrative functions
 * User management, project management, system configuration
 */

const User = require("../models/User");
const Project = require("../models/Project");
const bcrypt = require("bcryptjs");
const { sendWelcomeEmail } = require("../utils/email");

/**
 * CREATE USER
 * Creates a new advisor or student account
 * Sends welcome email with temporary credentials
 *
 * @param {Object} req - Express request object
 * @param {string} req.body.name - User's full name
 * @param {string} req.body.email - User's email
 * @param {string} req.body.password - Temporary password
 * @param {string} req.body.role - User role ('advisor' or 'student')
 * @param {Object} res - Express response object
 */
exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate role
  if (!["advisor", "student"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already in use" });

    // Hash password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Send welcome email with credentials
    try {
      await sendWelcomeEmail(email, name, password, role);
      console.log(`Welcome email sent to: ${email}`);
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError.message);
      // Continue even if email fails - user is still created
    }

    res
      .status(201)
      .json({
        message: "User created",
        user: { id: user._id, name, email, role },
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * CREATE PROJECT
 * Creates a new project with specified advisors and students
 * Used by admin to set up projects
 *
 * @param {Object} req - Express request object
 * @param {string} req.body.name - Project name
 * @param {string} req.body.description - Project description
 * @param {Array} req.body.advisorIds - Advisor user IDs
 * @param {Array} req.body.studentIds - Student user IDs
 * @param {Object} res - Express response object
 */
exports.createProject = async (req, res) => {
  const { name, description, advisorIds = [], studentIds = [] } = req.body;
  try {
    const project = await Project.create({
      name,
      description,
      advisors: advisorIds,
      students: studentIds,
    });
    res.status(201).json({ message: "Project created", project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET ALL USERS
 * Retrieves all users with optional role filtering
 * Excludes passwords for security
 *
 * @param {Object} req - Express request object
 * @param {string} req.query.role - Optional role filter ('admin', 'advisor', 'student')
 * @param {Object} res - Express response object
 */
exports.getAllUsers = async (req, res) => {
  try {
    const { role } = req.query; // optional filter ?role=student
    const filter = role ? { role } : {};

    // Get all users (as plain objects)
    const users = await User.find(filter).select("-password").lean();

    // Get all projects to map relationships
    const projects = await Project.find().select(
      "name advisors students"
    );

    // Attach projects to each user
    const usersWithProjects = users.map((user) => {
      const userProjects = projects
        .filter(
          (p) =>
            p.advisors.some((a) => a.toString() === user._id.toString()) ||
            p.students.some((s) => s.toString() === user._id.toString())
        )
        .map((p) => p.name);

      return {
        ...user,
        projects: userProjects,
      };
    });

    res.json(usersWithProjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET ALL PROJECTS
 * Retrieves all projects in the system
 * Includes advisor and student information
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("advisors", "name email")
      .populate("students", "name email");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE USER
 * Modifies user role or status
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.id - User ID
 * @param {string} req.body.role - New role
 * @param {boolean} req.body.status - User status
 * @param {Object} res - Express response object
 */
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { role, status } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update role if provided
    if (role) user.role = role;

    // Update status if provided
    if (status !== undefined) user.status = status;

    await user.save();
    res.json({ message: "User updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE PROJECT
 * Modifies project advisors or students
 * Used to reassign project members
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Project ID
 * @param {Array} req.body.advisors - New advisor list
 * @param {Array} req.body.students - New student list
 * @param {Object} res - Express response object
 */
exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { advisors, students } = req.body;

  try {
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Update advisors if provided
    if (advisors) project.advisors = advisors;

    // Update students if provided
    if (students) project.students = students;

    await project.save();
    res.json({ message: "Project updated", project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE USER
 * Removes a user from the system
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.id - User ID to delete
 * @param {Object} res - Express response object
 */
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE PROJECT
 * Removes a project from the system
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Project ID to delete
 * @param {Object} res - Express response object
 */
exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findByIdAndDelete(id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
