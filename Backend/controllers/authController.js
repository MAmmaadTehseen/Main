/**
 * Authentication Controller
 * Handles user authentication: signup, login, password reset
 */

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendPasswordResetEmail } = require("../utils/email");

/**
 * SIGNUP ENDPOINT
 * Creates a new user account for advisors and students
 * Password is hashed using bcrypt for security
 * Auto-generates JWT token for immediate login after signup
 *
 * @param {Object} req - Express request object
 * @param {string} req.body.name - User's full name
 * @param {string} req.body.email - User's email (must be unique)
 * @param {string} req.body.password - User's password
 * @param {string} req.body.role - User role ('advisor' or 'student')
 * @param {Object} res - Express response object
 */
exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate that role is either 'advisor' or 'student'
  if (!["advisor", "student"].includes(role)) {
    return res.status(400).json({ message: "Invalid role for signup" });
  }

  try {
    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    // Hash password using bcrypt (10 salt rounds for security)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Generate JWT token for auto-login after signup (expires in 1 day)
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Signup successful",
      token,
      user: { name: user.name, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * LOGIN ENDPOINT
 * Authenticates user with email and password
 * Returns JWT token if credentials are valid
 *
 * @param {Object} req - Express request object
 * @param {string} req.body.email - User's email
 * @param {string} req.body.password - User's password
 * @param {Object} res - Express response object
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare provided password with hashed password in database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token for authenticated session (expires in 1 day)
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user: { name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET CURRENT USER ENDPOINT
 * Returns authenticated user's profile data (without password)
 * Used to fetch user info after login
 *
 * @param {Object} req - Express request object (must include auth token in headers)
 * @param {Object} res - Express response object
 */
exports.getMe = async (req, res) => {
  try {
    // Find user by ID from authenticated request and exclude password field
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * FORGOT PASSWORD ENDPOINT
 * Sends password reset email with JWT token
 * Returns generic success message to prevent email enumeration attacks
 *
 * @param {Object} req - Express request object
 * @param {string} req.body.email - User's email address
 * @param {Object} res - Express response object
 */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    // Always return success message to prevent email enumeration
    // (attackers can't tell if email exists or not)
    if (!user) {
      return res.json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Generate reset token with 1-hour expiration
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send password reset email with link containing the token
    try {
      console.log("Attempting to send email to:", email);
      console.log("EMAIL_USER:", process.env.EMAIL_USER);
      console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
      await sendPasswordResetEmail(email, resetToken);
      console.log(`Password reset email sent successfully to: ${email}`);
    } catch (emailError) {
      console.error("Error sending email:", emailError.message);
      console.error("Full error:", emailError);
      // Still return success to prevent email enumeration
    }

    res.json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * RESET PASSWORD ENDPOINT
 * Verifies reset token and updates user's password
 * Token must be valid and not expired (1 hour validity)
 *
 * @param {Object} req - Express request object
 * @param {string} req.body.token - JWT reset token from email link
 * @param {string} req.body.newPassword - New password to set
 * @param {Object} res - Express response object
 */
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify the reset token and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Hash the new password with bcrypt
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    // Check if error is due to expired token
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Reset token has expired" });
    }
    res.status(500).json({ message: err.message });
  }
};
