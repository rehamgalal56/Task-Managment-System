class UserDTO {
  constructor(user) {
    this.id= user._id.toString(),
    this.fullName= user.fullName,
    this.email= user.email,
    this.jobRole= user.jobRole,
    this.gender= user.gender,
    this.birthDate= user.birthDate,
    this.phoneNumber= user.phoneNumber,
    this.aboutMe= user.aboutMe,
    this.image= user.image ? `${process.env.BASE_URL}/${user.image}` : null
  }
}

module.exports = UserDTO;