
class SectionDTO {
    constructor(section) {
      this.id = section._id;
      this.projectId = section.projectId._id || section.projectId;
      this.name = section.name;
      // You can add tasks later if needed
    }
  
    // Static method to convert a list of sections
    static list(sections) {
      return sections.map(section => new SectionDTO(section));
    }
  }
  
  module.exports = SectionDTO;
  