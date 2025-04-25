const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  membersOfProject: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, 
{ timestamps: true });

module.exports = mongoose.model('Project', projectSchema);





