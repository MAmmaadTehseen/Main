/**
 * File Upload Middleware
 * Configures file upload handling for different file types
 * Manages uploads for tasks (advisor files) and submissions (student files)
 */

const multer = require("multer");
const path = require("path");
const fs = require("fs");

/**
 * ENSURE DIRECTORY EXISTS
 * Helper function to create upload directories if they don't exist
 * Uses recursive creation to build full path
 *
 * @param {string} dir - Directory path to create
 */
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

/**
 * TASK STORAGE CONFIGURATION
 * Stores advisor-uploaded files (assignment PDFs, etc.)
 * Files saved to: uploads/tasks/
 * Filename: timestamp-randomnumber.extension
 */
const taskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/tasks";
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + ext);
  },
});

/**
 * SUBMISSION STORAGE CONFIGURATION
 * Stores student-uploaded submissions
 * Files saved to: uploads/submissions/
 * Filename: timestamp-randomnumber.extension
 */
const submissionStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/submissions";
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + ext);
  },
});

/**
 * FILE FILTER
 * Validates uploaded files
 * Currently accepts all file types - can be restricted as needed
 *
 * @param {Object} req - Express request
 * @param {Object} file - Uploaded file object
 * @param {Function} cb - Callback function
 */
const fileFilter = (req, file, cb) => {
  // Accept all files — add restrictions if needed
  cb(null, true);
};

// Create multer upload instances with configurations
const upload = multer({ storage: taskStorage, fileFilter });
const uploadSubmission = multer({ storage: submissionStorage, fileFilter });

module.exports = { upload, uploadSubmission };
