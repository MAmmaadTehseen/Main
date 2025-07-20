const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/tasks");
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

const upload = multer({ storage, fileFilter });

module.exports = upload;
