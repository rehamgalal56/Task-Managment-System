const Team = require("../models/team.model");
const Project = require("../models/project.model");
const TeamDTO = require("../dtos/team.dto");
const MemberDTO = require("../dtos/member.dto");


// Create a new team
exports.createTeam = async (req, res) => {
  try {
    const user = req.user;

    // Check if user is authenticated
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, projectId } = req.body;

    // Validate if the project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if a team with the same name already exists for this project
    const existingTeam = await Team.findOne({ name, projectId });
    if (existingTeam) {
      return res.status(400).json({ message: "Team already exists" });
    }

    // Create and save the new team
    const newTeam = new Team({
      name,
      projectId,
      
    });
    newTeam.members.push(user.id);

    await newTeam.save();

    // Convert to DTO for clean response
    const response = new TeamDTO(newTeam);
    res.status(201).json(response);
  } catch (error) {
    console.error("Create Team Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get all teams for a specific project
exports.getTeambyprojectId = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Fetch all teams under the given project
    const teams = await Team.find({ projectId });

    // Map each team to its DTO format
    const result = teams.map(team => new TeamDTO(team));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a team by its ID
exports.deleteTeam = async (req, res) => {
  try {
    const teamId = req.params.id;

    // Delete the team from the database
    await Team.findByIdAndDelete(teamId);

    res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Add a member to a team
exports.addMember = async (req, res) => {
  try {
    const { teamId, userId } = req.body;

    // Find the target team
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Check if the user is already a member
    if (team.members.includes(userId)) {
      return res.status(400).json({ message: "User already in team" });
    }

    // Add the user to the members array
    team.members.push(userId);
    await team.save();

    // Return the updated team using DTO
    const response = new TeamDTO(team);
    res.status(200).json({ message: "Member added successfully", team: response });
  } catch (error) {
    console.error("Add Member Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};


// Get all members of a specific team
exports.getMembers = async (req, res) => {
  try {
    const { teamId } = req.params;

    // Populate the member info (fullName, image) from related user docs
    const team = await Team.findById(teamId).populate("members", "fullName image");

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Convert each member to a DTO for the response
    const formattedMembers = team.members.map(member => new MemberDTO(member));
    res.status(200).json(formattedMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


