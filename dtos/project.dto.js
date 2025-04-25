class ProjectDTO {
    constructor(project) {
      this.id = project._id;
      this.name = project.name;
      this.type = project.type;
      this.description = project.description;
      this.createdBy = project.userId.username; 
      this.userId = project.userId._id;          // creator's ID
    }
  }
  
  module.exports = ProjectDTO;
  