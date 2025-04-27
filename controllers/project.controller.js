const Project = require('../models/project.model');
const Section = require('../models/Section.model');
const ProjectDTO = require('../dtos/project.dto');
const MemberDTO = require('../dtos/member.dto');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');

// Create a new project
exports.createProject = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { name, type, description, image } = req.body;

  const project = new Project({ name, type, description, image, userId });
  await project.save();

  const sections = [
    { name: 'To Do', projectId: project._id },
    { name: 'In Progress', projectId: project._id },
    { name: 'Done', projectId: project._id }
  ];
  await Section.insertMany(sections);

  project.membersOfProject.push(userId);
  await project.save();

  const populatedProject = await Project.findById(project._id).populate('userId', 'username');
  const projectDTO = new ProjectDTO(populatedProject);
  res.status(201).json(projectDTO);
});

// Get all projects the user is a member of
exports.getMyProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ membersOfProject: req.user.id }).populate('userId', 'username');
  const projectsDTO = projects.map(project => new ProjectDTO(project));
  res.json(projectsDTO);
});

// Get project code (just returns projectId)
exports.getCode = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  res.json(projectId);
});

// Join a project by its code (ID)
exports.joinProjectByCode = asyncHandler(async (req, res) => {
  const { Code } = req.body;
  const userId = req.user.id;

  const project = await Project.findById(Code).populate('userId', 'username');
  if (!project) throw new ApiError('Project not found', 404);

  if (project.membersOfProject.includes(userId)) {
    throw new ApiError('You are already a member of this project', 400);
  }

  project.membersOfProject.push(userId);
  await project.save();

  const projectDTO = new ProjectDTO(project);
  res.json({ message: 'Joined project successfully', project: projectDTO });
});

// Get all members of a project
exports.getProjectMembers = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId).populate('membersOfProject', 'fullName image');
  if (!project) throw new ApiError('Project not found', 404);

  const membersDTO = project.membersOfProject.map(user => new MemberDTO(user));
  res.json(membersDTO);
});

// Leave a project
exports.leaveProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user.id;

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError('Project not found', 404);

  if (!project.membersOfProject.includes(userId)) {
    throw new ApiError('You are not a member of this project', 400);
  }

  project.membersOfProject = project.membersOfProject.filter(member => member.toString() !== userId);
  await project.save();

  res.json({ message: 'You have left the project' });
});

// Delete a project
exports.deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError('Project not found', 404);

  if (project.userId.toString() !== req.user.id) {
    throw new ApiError('Unauthorized action. You must be the owner of the project', 403);
  }

  await Project.findByIdAndDelete(projectId);
  res.json({ message: 'Project deleted successfully' });
});
