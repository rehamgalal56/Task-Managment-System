const TaskDTO = require('./task.dto'); // make sure the path is correct

class SectionDTO {
    constructor(section) {
      this.id = section._id;
      this.projectId = section.projectId._id || section.projectId;
      this.name = section.name;
      // You can add tasks later if needed
      this.tasks =  section.tasks.map(task => new TaskDTO(task)) ;

    }
  
    // Static method to convert a list of sections
    static list(sections) {
      return sections.map(section => new SectionDTO(section));
    }
  }
  
  module.exports = SectionDTO;
  