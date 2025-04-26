const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');



router.get('/profile', authMiddleware, userController.getCurrentUser);
router.put('/editProfile', authMiddleware, upload.single('image'),userController.updateCurrentUser);

module.exports = router;