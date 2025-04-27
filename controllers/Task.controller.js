const Task = require("../models/Task.model");
const Project = require("../models/project.model");
const Section = require("../models/Section.model");
const { isUserInProject, isProjectManager } = require("../utils/validators");

const TaskDTO = require("../dtos/task.dto");

exports.createTask = async (req, res) => {
  const { title, description, projectId, sectionId } = req.body;
  const userId = req.user.id;

  try {
    const project = await Project.findById(projectId);
    if (!isUserInProject(project, userId))
      return res
        .status(403)
        .json({ msg: "You are not a member of this project" });
    if (!project) return res.status(404).json({ msg: "Project not found" });

    const section = await Section.findOne({ _id: sectionId, projectId });
    if (!section)
      return res
        .status(404)
        .json({ msg: "Section not found in this project " });

    const task = new Task({
      title,
      description,
      project: projectId,
      section: sectionId,
      createdBy: userId,
    });

    section.tasks.push(task);

    await task.save();
    await section.save();

    res.status(201).json(new TaskDTO(task));
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const task = await Task.findById(id).populate("project");
    if (!task) return res.status(404).json({ msg: "Task not found" });

    const project = await Project.findById(task.project);
    if (!project) return res.status(404).json({ msg: "Project not found" });

    if (!isUserInProject(project, userId))
      return res
        .status(403)
        .json({ msg: "You are not a member of this project" });

    const isCreator = task.createdBy.toString() === userId;
    const isManager = isProjectManager(project, userId);

    if (!isCreator && !isManager)
      return res
        .status(403)
        .json({
          msg: "Only the task creator or project manager can delete this task",
        });

    await task.deleteOne();

    res.status(200).json({
      msg: "Task deleted successfully",
      deletedTask: {
        id: task._id,
        title: task.title,
        section: task.section,
        project: task.project._id,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
exports.getTaskById = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId)
      .populate("project")
      .populate("section")
      .populate("assignedTo"); // populate assigned users

    if (!task) return res.status(404).json({ msg: "Task not found" });

    res.status(200).json(new TaskDTO(task)); // 👈 use new DTO class
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
exports.moveTaskToSection = async (req, res) => {
  const { taskId, newSectionId } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const oldSectionId = task.sectionId;

    task.sectionId = newSectionId;
    await task.save();

    await Section.findByIdAndUpdate(oldSectionId, {
      $pull: { tasks: task._id },
    });

    await Section.findByIdAndUpdate(newSectionId, {
      $addToSet: { tasks: task._id },
    });

    res
      .status(200)
      .json({ message: "Task moved successfully", task: new TaskDTO(task) }); // 👈 wrap moved task
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};



exports.assignTask = async (req, res) => {
  const { id, assigneeId } = req.body;
  const userId = req.user.id;

  try {
    const task = await Task.findById(id).populate("project");
    if (!task) return res.status(404).json({ msg: "Task not found" });

    const project = await Project.findById(task.project);
    if (!project) return res.status(404).json({ msg: "Project not found" });

    if (!isUserInProject(project, userId))
      return res.status(403).json({ msg: "You are not a member of this project" });

    const isCreator = task.createdBy.toString() === userId;
    const isManager = isProjectManager(project, userId);
    if (!isCreator && !isManager)
      return res.status(403).json({ msg: "Only creator or manager can assign" });

    if (!isUserInProject(project, assigneeId))
      return res.status(400).json({ msg: "Assignee must be in the project" });

    task.assignedTo = assigneeId;
    await task.save();

    const populatedTask = await Task.findById(task._id).populate("assignedTo");

    res.status(200).json(new TaskDTO(populatedTask)); // 👈
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.editTask = async (req, res) => {
  const {
    id,
    name,
    description,
    startDate,
    dueDate,
    isCompleted,
    assigneeUsers
  } = req.body;
  const userId = req.user.id;

  try {
    const task = await Task.findById(id).populate("project");
    if (!task) return res.status(404).json({ msg: "Task not found" });

    const project = await Project.findById(task.project);
    if (!project) return res.status(404).json({ msg: "Project not found" });

    if (!isUserInProject(project, userId))
      return res.status(403).json({ msg: "You are not a member of this project" });

    const isCreator = task.createdBy.toString() === userId;
    const isManager = isProjectManager(project, userId);
    if (!isCreator && !isManager)
      return res.status(403).json({ msg: "Only creator or manager can edit" });

    if (assigneeUsers && assigneeUsers.length > 0) {
      for (const element of assigneeUsers) {
        if (!isUserInProject(project, element.userId)) {
          return res.status(400).json({ msg: "All assignees must be project members" });
        }
      }
    }

    if (name) task.title = name; // task.title, not task.name
    if (description) task.description = description;
    if (startDate) task.startDate = new Date(startDate);
    if (dueDate) task.dueDate = new Date(dueDate);
    if (typeof isCompleted === 'boolean') task.isCompleted = isCompleted;

    // Remove existing assignees
    await Assignee.deleteMany({ taskItemId: id });

    // Add new assignees
    if (assigneeUsers && assigneeUsers.length > 0) {
      const assigneeDocs = assigneeUsers.map(a => ({
        userId: a.userId,
        taskItemId: id
      }));
      await Assignee.insertMany(assigneeDocs);
    }

    await task.save();

    const populatedTask = await Task.findById(task._id).populate("assignedTo");

    res.status(200).json(new TaskDTO(populatedTask)); // 👈
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};