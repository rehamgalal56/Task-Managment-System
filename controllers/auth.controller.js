const User = require('../models/user.model');
const { validateUserSignup } = require('../utils/signup.validators');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  // Validate request body using Joi schema
  const { error } = validateUserSignup(req.body);
  if (error) {
    // Return validation error messages if validation fails
    return res.status(400).json({ error: error.message });
  }

  try {
    const { email, fullName, password, confirmPassword } = req.body;

    // Ensure password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate a JWT token 
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Return the token 
    res.status(201).json({ token });

  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ error: 'An error occurred during signup. Please try again later.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });

    //  If user doesn't exist or password is incorrect, return 401 Unauthorized
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token 
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Send token in response
    res.json({ token });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'An error occurred during login. Please try again later.' });
  }
};


exports.logout = (req, res) => {
  // For stateless JWT, logout can be handled on client side
  res.json({ message: 'Logged out (client-side)' });
};