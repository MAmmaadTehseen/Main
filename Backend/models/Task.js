const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  instructions: String,
  fileUrl: String,
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isDone: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
