const express = require("express");
const router = express.Router();
const taskController = require("../controllers/Task.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/add", authMiddleware, taskController.createTask);
router.delete("/:id", authMiddleware, taskController.deleteTask);

module.exports = router;
