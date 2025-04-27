const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project", // Reference to the Project model
    required: true,
  },
  createdTime: {
    type: Date,
    default: Date.now,
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});

module.exports =
  mongoose.models.Section || mongoose.model("Section", SectionSchema);
