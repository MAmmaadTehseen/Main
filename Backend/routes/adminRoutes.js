/**
 * Admin Routes
 * Defines endpoints for system administrator operations
 * All routes require authentication and admin role verification
 * Admins have full access to user and project management
 */

const express = require("express");
const router = express.Router();
const {
  createUser,
  createProject,
  getAllUsers,
  getAllProjects,
  updateUser,
  updateProject,
  deleteUser,
  deleteProject,
} = require("../controllers/adminController");

const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");

// ===== USER MANAGEMENT ROUTES =====

/**
 * POST /api/admin/create-user
 * Create a new user account (advisor or student)
 * Protected Route - Admin only
 * Body: { email, password, name, role }
 * Returns: Created user object with ID
 */
router.post("/create-user", authMiddleware, adminOnly, createUser);

/**
 * GET /api/admin/users
 * Retrieve all users in the system
 * Protected Route - Admin only
 * Query: role (optional) - filter by user role (admin, advisor, student)
 * Returns: Array of all user objects
 */
router.get("/users", authMiddleware, adminOnly, getAllUsers);

/**
 * PATCH /api/admin/users/:id
 * Update user information
 * Protected Route - Admin only
 * Params: id (userId)
 * Body: Fields to update (name, email, role, etc)
 * Returns: Updated user object
 */
router.patch("/users/:id", authMiddleware, adminOnly, updateUser);

/**
 * DELETE /api/admin/users/:id
 * Delete a user from the system
 * Protected Route - Admin only
 * Params: id (userId)
 * Returns: Success message
 */
router.delete("/users/:id", authMiddleware, adminOnly, deleteUser);

// ===== PROJECT MANAGEMENT ROUTES =====

/**
 * POST /api/admin/create-project
 * Create a new FYP project
 * Protected Route - Admin only
 * Body: { title, description, advisorId, startDate, endDate }
 * Returns: Created project object
 */
router.post("/create-project", authMiddleware, adminOnly, createProject);

/**
 * GET /api/admin/projects
 * Retrieve all projects in the system
 * Protected Route - Admin only
 * Returns: Array of all project objects
 */
router.get("/projects", authMiddleware, adminOnly, getAllProjects);

/**
 * PATCH /api/admin/projects/:id
 * Update project information
 * Protected Route - Admin only
 * Params: id (projectId)
 * Body: Fields to update (title, description, advisor, etc)
 * Returns: Updated project object
 */
router.patch("/projects/:id", authMiddleware, adminOnly, updateProject);

/**
 * DELETE /api/admin/projects/:id
 * Delete a project from the system
 * Protected Route - Admin only
 * Params: id (projectId)
 * Returns: Success message
 */
router.delete("/projects/:id", authMiddleware, adminOnly, deleteProject);

module.exports = router;
