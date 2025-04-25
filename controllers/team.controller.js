const Team = require("../models/team.model");
const Project = require("../models/project.model");
const TeamDTO = require("../dtos/team.dto");
// const MemberDTO = require("../dtos/member.dto");


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
      members: [user?._id].filter(Boolean), // Avoids inserting undefined into the array.
    });

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


