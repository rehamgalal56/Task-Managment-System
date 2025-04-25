class TeamDTO {
  constructor(team) {
    this.id = team._id.toString();
    this.name = team.name;
    
  }
}

module.exports = TeamDTO;
