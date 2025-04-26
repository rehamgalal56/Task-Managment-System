const User = require('../models/user.model');
const UserDTO  = require('../dtos/user.dto');
const { validateUserUpdate } = require('../utils/user.validators');

exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId, '-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userDto = new UserDTO(user);

    res.json(userDto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};


exports.updateCurrentUser = async (req, res) => {
  const { error } = validateUserUpdate(req.body);
    if (error) {
      // Return validation error messages if validation fails
      return res.status(400).json({ error: error.message });
    }
  try {
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
      return res.status(404).json({ error: 'User not found' });
    }

    const userDTO = new UserDTO(updatedUser);
    res.json(userDTO);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





  