const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { getProjectMessages } = require("../controllers/discussionController");

router.get("/:projectId", authMiddleware, getProjectMessages);


const { postMessage } = require("../controllers/discussionController");


router.post("/:projectId", authMiddleware, postMessage);


module.exports = router;
