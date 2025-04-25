const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/section.controller');
const authMiddleware = require('../middleware/auth.middleware');


router.post('/add',authMiddleware, sectionController.createSection);
router.get('/getAll/:projectId',sectionController.getSections);
router.put('/edit/', authMiddleware,sectionController.updateSection);
router.delete('/:id',authMiddleware, sectionController.deleteSection);

module.exports = router;