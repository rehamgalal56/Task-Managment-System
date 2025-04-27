const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const validatorMiddleware = require('../middleware/validatorMiddleware');
const { validateUserUpdate } = require('../utils/user.validators');


router.get('/profile', authMiddleware, userController.getCurrentUser);
router.put('/editProfile', authMiddleware, upload.single('image'),validatorMiddleware(validateUserUpdate),userController.updateCurrentUser);

module.exports = router;