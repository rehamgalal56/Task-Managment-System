const Task = require("../models/task.model");
const Section = require("../models/section.model");
const Project = require("../models/project.model");
const TaskDTO = require("../dtos/task.dto");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("express-async-handler");
const { isUserInProject, isProjectManager } = require("../utils/validators");

exports.getTask = asyncHandler(async (req, res, next) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId)
    .populate("project")
    .populate("section")
    .populate("assignedTo");

  if (!task) {
    return next(new ApiError("Task not found", 404));
  }

  const taskDTO = new TaskDTO(task);
  res.json(taskDTO);
});

exports.createTask = asyncHandler(async (req, res, next) => {
  const { title, description, projectId, sectionId } = req.body;
  const userId = req.user.id;

  const project = await Project.findById(projectId);
  if (!project) {
    return next(new ApiError("Project not found", 404));
  }

  if (!isUserInProject(project, userId)) {
    return next(new ApiError("You are not a member of this project", 403));
  }

  const section = await Section.findOne({ _id: sectionId, projectId });
  if (!section) {
    return next(new ApiError("Section not found in this project", 404));
  }

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

  const taskDTO = new TaskDTO(task);
  res.status(201).json(taskDTO);
});

exports.moveTask = asyncHandler(async (req, res, next) => {
  const { taskId, newSectionId } = req.body;

  const task = await Task.findById(taskId);
  if (!task) {
    return next(new ApiError("Task not found", 404));
  }

  const oldSectionId = task.section;
  task.section = newSectionId;
  await task.save();

  await Section.findByIdAndUpdate(oldSectionId, {
    $pull: { tasks: task._id },
  });

  await Section.findByIdAndUpdate(newSectionId, {
    $addToSet: { tasks: task._id },
  });

  const taskDTO = new TaskDTO(task);
  res.json(taskDTO);
});

exports.assignTask = asyncHandler(async (req, res, next) => {
  const { id, assigneeId } = req.body;
  const userId = req.user.id;

  const task = await Task.findById(id).populate("project");
  if (!task) {
    return next(new ApiError("Task not found", 404));
  }

  const project = await Project.findById(task.project);
  if (!project) {
    return next(new ApiError("Project not found", 404));
  }

  if (!isUserInProject(project, userId)) {
    return next(new ApiError("You are not a member of this project", 403));
  }

  const isCreator = task.createdBy.toString() === userId;
  const isManager = isProjectManager(project, userId);

  if (!isCreator && !isManager) {
    return next(new ApiError("Only creator or manager can assign", 403));
  }

  if (!isUserInProject(project, assigneeId)) {
    return next(new ApiError("Assignee must be a member of the project", 400));
  }

  task.assignedTo = assigneeId;
  await task.save();

  const populatedTask = await Task.findById(task._id).populate("assignedTo");
  const taskDTO = new TaskDTO(populatedTask);

  res.json(taskDTO);
});

exports.deleteTask = asyncHandler(async (req, res, next) => {
  const { taskId } = req.params;
  const userId = req.user.id;

  const task = await Task.findById(taskId).populate("project");
  if (!task) {
    return next(new ApiError("Task not found", 404));
  }

  const project = await Project.findById(task.project);
  if (!project) {
    return next(new ApiError("Project not found", 404));
  }

  if (!isUserInProject(project, userId)) {
    return next(new ApiError("You are not a member of this project", 403));
  }

  const isCreator = task.createdBy.toString() === userId;
  const isManager = isProjectManager(project, userId);

  if (!isCreator && !isManager) {
    return next(
      new ApiError(
        "Only the creator or project manager can delete this task",
        403
      )
    );
  }

  await task.deleteOne();

  res.json({
    msg: "Task deleted successfully",
    deletedTask: {
      id: task._id,
      title: task.title,
      section: task.section,
      project: task.project._id,
    },
  });
});
exports.editTask = asyncHandler(async (req, res, next) => {
  const {
    id,
    name,
    description,
    startDate,
    dueDate,
    isCompleted,
    assigneeUsers,
  } = req.body;

  const userId = req.user.id;

  const task = await Task.findById(id).populate("project");
  if (!task) {
    return next(new ApiError("Task not found", 404));
  }

  const project = await Project.findById(task.project);
  if (!project) {
    return next(new ApiError("Project not found", 404));
  }

  if (!isUserInProject(project, userId)) {
    return next(new ApiError("You are not a member of this project", 403));
  }

  const isCreator = task.createdBy.toString() === userId;
  const isManager = isProjectManager(project, userId);

  if (!isCreator && !isManager) {
    return next(
      new ApiError("Only the task creator or project manager can edit", 403)
    );
  }

  for (const assignee of assigneeUsers) {
    if (!isUserInProject(project, assignee.userId)) {
      return next(
        new ApiError("Assignee must be a member of this project", 400)
      );
    }
  }

  if (name) task.title = name;
  if (description) task.description = description;
  if (startDate) task.startDate = new Date(startDate);
  if (dueDate) task.dueDate = new Date(dueDate);
  if (typeof isCompleted === "boolean") task.isCompleted = isCompleted;

  // Remove old assignees
  await Assignee.deleteMany({ taskItemId: id });

  // Add new assignees
  if (assigneeUsers && assigneeUsers.length > 0) {
    const assigneeDocs = assigneeUsers.map((a) => ({
      userId: a.userId,
      taskItemId: id,
    }));
    await Assignee.insertMany(assigneeDocs);
  }

  await task.save();

  const populatedTask = await Task.findById(task._id).populate("assignedTo");

  res.status(200).json(new TaskDTO(populatedTask));
});
