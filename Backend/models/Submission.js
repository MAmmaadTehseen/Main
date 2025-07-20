const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileUrl: { type: String, required: true },
  marks: { type: Number, default: null },
  status: { type: String, enum: ["pending", "submitted", "evaluated"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Submission", submissionSchema);
