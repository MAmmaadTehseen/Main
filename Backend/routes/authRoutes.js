/**
 * Authentication Routes
 * Defines endpoints for user authentication, login, signup, and password reset
 * No role restrictions - accessible to all users
 */

const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getMe,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

/**
 * POST /api/auth/signup
 * Register a new user account
 * Body: { email, password, name, role }
 * Returns: User object with JWT token
 */
router.post("/signup", signup);

/**
 * POST /api/auth/login
 * Authenticate user and receive JWT token
 * Body: { email, password }
 * Returns: User object with JWT token
 */
router.post("/login", login);

/**
 * GET /api/auth/me
 * Get current authenticated user's profile information
 * Protected Route - Requires valid JWT token
 * Returns: Current user object
 */
router.get("/me", authMiddleware, getMe);

/**
 * POST /api/auth/forgot-password
 * Request password reset email
 * Body: { email }
 * Returns: Success message with reset token
 */
router.post("/forgot-password", forgotPassword);

/**
 * POST /api/auth/reset-password
 * Reset password using reset token from email
 * Body: { token, newPassword }
 * Returns: Success message
 */
router.post("/reset-password", resetPassword);

module.exports = router;
