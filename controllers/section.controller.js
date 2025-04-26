const Section = require('../models/Section.model');
const Project = require('../models/project.model');
const SectionDTO = require('../dtos/section.dto'); 

exports.createSection = async (req, res) => {
  try {
    const { name, projectId } = req.body;

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const section = new Section({ name, projectId });
    await section.save();

    res.status(201).json(new SectionDTO(section));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSections = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Find sections and populate tasks
    const sections = await Section.find({ projectId }).populate('tasks');

    res.json(SectionDTO.list(sections)); // Use static list method
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { id, name } = req.body;

    const section = await Section.findByIdAndUpdate(id, { name }, { new: true });
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }

    res.json(new SectionDTO(section));
  } catch (error) {
    res.status(500).json({ error: 'Failed to update section', details: error.message });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const { id } = req.params;

    const section = await Section.findByIdAndDelete(id);
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }

    res.status(200).json({ message: 'Section deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete section', details: error.message });
  }
};