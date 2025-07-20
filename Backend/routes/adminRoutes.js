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

// Admin routes
router.post("/create-user", authMiddleware, adminOnly, createUser);
router.post("/create-project", authMiddleware, adminOnly, createProject);

router.get("/users", authMiddleware, adminOnly, getAllUsers);
router.get("/projects", authMiddleware, adminOnly, getAllProjects);

router.patch("/users/:id", authMiddleware, adminOnly, updateUser);
router.patch("/projects/:id", authMiddleware, adminOnly, updateProject);

router.delete("/users/:id", authMiddleware, adminOnly, deleteUser);
router.delete("/projects/:id", authMiddleware, adminOnly, deleteProject);

module.exports = router;
