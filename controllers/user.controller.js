const User = require('../models/user.model');
const UserDTO  = require('../dtos/user.dto');
const ApiError = require('../utils/APiError');
const asyncHandler = require('express-async-handler'); // << Add this

exports.getCurrentUser = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId, '-password');

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  const userDto = new UserDTO(user);
  res.json(userDto);
});



exports.updateCurrentUser = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const updateFields = req.body;

  if (req.file) {
    updateFields.image = `uploads/${req.file.filename}`;
  }

  if (updateFields.password) {
    delete updateFields.password;
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!updatedUser) {
    return next(new APIError('User not found', 404));
  }

  const userDTO = new UserDTO(updatedUser);
  res.json(userDTO);
});






  