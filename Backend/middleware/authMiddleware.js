/**
 * Authentication Middleware
 * Handles JWT token verification and role-based access control
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * AUTH MIDDLEWARE
 * Verifies JWT token from request headers and attaches user to request object
 * Must be used before endpoints that require authentication
 *
 * @param {Object} req - Express request object
 * @param {Object} req.headers.authorization - Bearer token from client (format: "Bearer <token>")
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.authMiddleware = async (req, res, next) => {
  // Extract token from "Authorization: Bearer <token>" header
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    // Verify token and extract user ID and role
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch full user object from database (excluding password)
    req.user = await User.findById(decoded.userId).select("-password");
    if (!req.user) return res.status(401).json({ message: "User not found" });

    // Continue to next middleware/route handler
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

/**
 * ADMIN ONLY MIDDLEWARE
 * Restricts endpoint access to users with 'admin' role
 * Must be used AFTER authMiddleware
 *
 * @param {Object} req - Express request object (must have req.user from authMiddleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
};

/**
 * ADVISOR ONLY MIDDLEWARE
 * Restricts endpoint access to users with 'advisor' role
 * Must be used AFTER authMiddleware
 *
 * @param {Object} req - Express request object (must have req.user from authMiddleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.advisorOnly = (req, res, next) => {
  if (req.user.role !== "advisor") {
    return res.status(403).json({ message: "Access denied: Advisors only" });
  }
  next();
};

/**
 * STUDENT ONLY MIDDLEWARE
 * Restricts endpoint access to users with 'student' role
 * Must be used AFTER authMiddleware
 *
 * @param {Object} req - Express request object (must have req.user from authMiddleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.studentOnly = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Access denied: Students only" });
  }
  next();
};
