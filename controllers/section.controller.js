const Section = require('../models/Section.model');
const Project = require('../models/project.model');
const SectionDTO = require('../dtos/section.dto'); 
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/APiError');

exports.createSection =  asyncHandler(async (req, res, next) => {
  try {
    const { name, projectId } = req.body;

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return next(new ApiError('Project not found', 404));
    }

    const section = new Section({ name, projectId });
    await section.save();

    res.status(201).json(new SectionDTO(section));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

exports.getSections =  asyncHandler(async (req, res, next) => {
  try {
    const { projectId } = req.params;

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return next(new ApiError('Project not found', 404));
    }
    
    // Find sections and populate tasks
    const sections = await Section.find({ projectId }).populate('tasks');

    res.json(SectionDTO.list(sections)); // Use static list method
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

exports.updateSection = asyncHandler(async (req, res, next) => {
  try {
    const { id, name } = req.body;

    const section = await Section.findByIdAndUpdate(id, { name }, { new: true });
    if (!section) {
      return next(new ApiError('Section not found', 404));
    }

    res.json(new SectionDTO(section));
  } catch (error) {
    res.status(500).json({ error: 'Failed to update section', details: error.message });
  }
});

exports.deleteSection = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    const section = await Section.findByIdAndDelete(id);
    if (!section) {
      return next(new ApiError('Section not found', 404));
    }

    res.status(200).json({ message: 'Section deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete section', details: error.message });
  }
});
