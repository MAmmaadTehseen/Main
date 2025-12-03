const User = require("../models/User");
const Project = require("../models/Project");
const bcrypt = require("bcryptjs");
const { sendWelcomeEmail } = require("../utils/email");

// Create new user (advisor or student)
exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!["advisor", "student"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword, role });

    // Send welcome email with credentials
    try {
      await sendWelcomeEmail(email, name, password, role);
      console.log(`Welcome email sent to: ${email}`);
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError.message);
      // Continue even if email fails - user is still created
    }

    res.status(201).json({ message: "User created", user: { id: user._id, name, email, role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new project
exports.createProject = async (req, res) => {
  const { name, description, advisorIds = [], studentIds = [] } = req.body;
  try {
    const project = await Project.create({ name, description, advisors: advisorIds, students: studentIds });
    res.status(201).json({ message: "Project created", project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { role } = req.query; // optional filter ?role=student
    const filter = role ? { role } : {};
    const users = await User.find(filter).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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

// Update user (role/status)
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { role, status } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (role) user.role = role;
    if (status !== undefined) user.status = status;

    await user.save();
    res.json({ message: "User updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update project (add/remove advisors or students)
exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { advisors, students } = req.body;

  try {
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (advisors) project.advisors = advisors;
    if (students) project.students = students;

    await project.save();
    res.json({ message: "Project updated", project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete user
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

// Delete project
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
