const express = require("express");
const router = express.Router();
const taskController = require("../controllers/Task.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/add", authMiddleware, taskController.createTask);
router.delete("/:id", authMiddleware, taskController.deleteTask);
router.get("/:taskId", authMiddleware, taskController.getTaskById);
router.put("/move", authMiddleware, taskController.moveTaskToSection);
router.post("/assign", authMiddleware, taskController.assignTask);
router.post("/edit", authMiddleware, taskController.editTask);
module.exports = router;
