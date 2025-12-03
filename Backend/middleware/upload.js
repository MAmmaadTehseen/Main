const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Storage for task files (advisor uploads)
const taskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/tasks";
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, unique + ext);
  }
});

// Storage for submission files (student uploads)
const submissionStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/submissions";
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, unique + ext);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept all files — add restrictions if needed
  cb(null, true);
};

const upload = multer({ storage: taskStorage, fileFilter });
const uploadSubmission = multer({ storage: submissionStorage, fileFilter });

module.exports = { upload, uploadSubmission };
