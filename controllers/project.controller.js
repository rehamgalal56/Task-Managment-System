const Project = require('../models/project.model');
const ProjectDTO = require('../dtos/project.dto');
const MemberDTO = require('../dtos/member.dto');

exports.createProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, type, description, image } = req.body;

    // Create the project
    const project = new Project({ name, type, description, image, userId });
    await project.save(); 

    //Add the creator as a member
    project.membersOfProject.push(userId ); 
    await project.save();

    //Populate creator info 
    const populatedProject = await Project.findById(project._id).populate('userId', 'username');

    const projectDTO = new ProjectDTO(populatedProject);
    res.status(201).json(projectDTO);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
  };

exports.getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ membersOfProject: req.user.id })
    .populate('userId', 'username');

    const projectsDTO = projects.map(project => new ProjectDTO(project));
    res.json(projectsDTO);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch your projects' });
  }
  };

exports.getCode = async (req, res) => {
    try {
        const { projectId } = req.params;
      res.json(projectId);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  };

exports.joinProjectByCode = async (req, res) => {
    try {
      const { Code } = req.body;
      const userId = req.user.id;
  
      // Find the project by the code (ID)
      const project = await Project.findById(Code).populate('userId', 'username');
      if (!project) return res.status(404).json({ error: 'Project not found' });
  
      // Check if the user is already a member of the project
      if (project.membersOfProject.includes(userId)) {
        return res.status(400).json({ error: 'You are already a member of this project' });
      }
  
      // Add the user to the project members if not already a member
      project.membersOfProject.push(userId);
      await project.save();
  
      const projectDTO = new ProjectDTO(project);
      res.json({ message: 'Joined project successfully', project: projectDTO });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to join project' });
    }
  };
  
  
exports.getProjectMembers = async (req, res) => {
    try {
      const { projectId } = req.params;
  
      const project = await Project.findById(projectId)
        .populate('membersOfProject', 'fullName image'); // Populate only (fullName and image)
  
      if (!project) return res.status(404).json({ error: 'Project not found' });
  
      // Map over the membersOfProject and convert each user to MemberDTO
      const membersDTO = project.membersOfProject.map(user => new MemberDTO(user));
  
      res.json(membersDTO);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  


 