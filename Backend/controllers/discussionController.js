const Discussion = require("../models/Discussion");

// Get all messages for a project
exports.getProjectMessages = async (req, res) => {
  const { projectId } = req.params;
  try {
    const messages = await Discussion.find({ projectId })
      .populate("sender", "name role")
      .sort({ createdAt: 1 }); // Sort messages by time
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Post a new message
exports.postMessage = async (req, res) => {
  const { projectId } = req.params;
  const { message } = req.body;

  try {
    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    const newMessage = await Discussion.create({
      projectId,
      sender: req.user._id,
      message,
    });

    const populatedMessage = await newMessage.populate("sender", "name role");

    res.status(201).json(populatedMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
