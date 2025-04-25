const User = require('../models/user.model');
const UserDTO  = require('../dtos/user.dto');

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




  