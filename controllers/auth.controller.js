const User = require('../models/user.model');
const { validateUserSignup } = require('../utils/signup.validators');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const APIError = require('../utils/APiError'); 
const asyncHandler = require('express-async-handler');


exports.signup = asyncHandler(async (req, res, next) => {
  const { password, confirmPassword, email, fullName, jobRole, gender, birthDate, aboutMe } = req.body;

  if (password !== confirmPassword) {
    return next(new APIError('Passwords do not match', 400));
  }

  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new APIError('Email already registered', 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username: fullName,
    password: hashedPassword,
    fullName,
    email,
    image: req.file?.path,
    jobRole,
    gender,
    birthDate,
    aboutMe,
  });

  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' });

  res.status(201).json({ token });
});


exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new APIError('Invalid credentials', 401));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return next(new APIError('Invalid credentials', 401));
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3h' });

  res.json({ token });
});


exports.logout = asyncHandler(async (req, res, next) => {
  res.json({ message: 'Logged out (client-side)' });
});
