const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', authMiddleware, projectController.createProject);
router.get('/my-projects', authMiddleware, projectController.getMyProjects);
router.post('/join-by-code', authMiddleware, projectController.joinProjectByCode);
router.get('/members/:projectId', authMiddleware, projectController.getProjectMembers);
router.get('/code/:projectId', authMiddleware, projectController.getCode);

module.exports = router;