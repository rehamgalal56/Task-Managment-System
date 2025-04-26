const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      required: false, // optional like `DateOnly?`
    },
    dueDate: {
      type: Date,
      required: false, // optional like `DateOnly?`
    },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // ✅ Add this field
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
