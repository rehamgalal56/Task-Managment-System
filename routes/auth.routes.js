const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validatorMiddleware = require('../middleware/validatorMiddleware');
const { validateUserSignup } = require('../utils/signup.validators');

router.post('/signup', validatorMiddleware(validateUserSignup),authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;