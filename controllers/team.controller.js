const Team = require("../models/team.model");
const Project = require("../models/project.model");
const TeamDTO = require("../dtos/team.dto");
const MemberDTO = require("../dtos/member.dto");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/APiError");

// Create a new team
exports.createTeam = asyncHandler(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    throw new ApiError("Unauthorized", 401);
  }

  const { name, projectId } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError("Project not found", 404);
  }

  const existingTeam = await Team.findOne({ name, projectId });
  if (existingTeam) {
    throw new ApiError("Team already exists", 400);
  }

  const newTeam = new Team({
    name,
    projectId,
     members: [user.id], 
  });
    //  newTeam.members.push(user.id);

  await newTeam.save();

  const response = new TeamDTO(newTeam);
  res.status(201).json(response);
});

// Get all teams for a specific project
exports.getTeambyprojectId = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;

  const teams = await Team.find({ projectId });

  const result = teams.map(team => new TeamDTO(team));
  res.status(200).json(result);
});

// Delete a team by its ID
exports.deleteTeam = asyncHandler(async (req, res, next) => {
  const { id: teamId } = req.params;

  const team = await Team.findByIdAndDelete(teamId);

  if (!team) {
    throw new ApiError("Team not found", 404);
  }

  res.status(200).json({ message: "Team deleted successfully" });
});

// Add a member to a team
exports.addMember = asyncHandler(async (req, res, next) => {
  const { teamId, userId } = req.body;

  const team = await Team.findById(teamId);
  if (!team) {
    throw new ApiError("Team not found", 404);
  }

  if (team.members.includes(userId)) {
    throw new ApiError("User already in team", 400);
  }

  team.members.push(userId);
  await team.save();

  const response = new TeamDTO(team);
  res.status(200).json({ message: "Member added successfully", team: response });
});

// Get all members of a specific team
exports.getMembers = asyncHandler(async (req, res, next) => {
  const { teamId } = req.params;

  const team = await Team.findById(teamId).populate("members", "fullName image");
  if (!team) {
    throw new ApiError("Team not found", 404);
  }

  const formattedMembers = team.members.map(member => new MemberDTO(member));
  res.status(200).json(formattedMembers);
});
