
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  image: { type: String },
  jobRole: { type: String },
  phoneNumber: { type: String },
  gender: { type: String },
  birthDate: { type: String },
  aboutMe: { type: String }
});

module.exports = mongoose.model('User', userSchema);
