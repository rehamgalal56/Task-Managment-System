// routes/team.routes.js
const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/create', authMiddleware, teamController.createTeam);
router.get('/get-teams/:projectId',authMiddleware, teamController.getTeambyprojectId);
router.delete('/:id',authMiddleware, teamController.deleteTeam);
router.post('/add-member',authMiddleware, teamController.addMember);
router.get('/:teamId/members',authMiddleware, teamController.getMembers);



module.exports = router;
