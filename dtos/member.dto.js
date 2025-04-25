class MemberDTO {
    constructor(user) {
      this.id = user._id.toString(); 
      this.fullName = user.fullName;
      this.image = user.image ? `http://localhost:3000/${user.image}` : null; 
    }
  }
  
  module.exports = MemberDTO; 