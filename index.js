const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const projectRoutes = require("./routes/project.routes");
const teamRoutes = require("./routes/team.routes");
const sectionRoutes = require("./routes/Section.routes");
const taskRoutes = require("./routes/task.routes");

const logger = require("./utils/logger");
const errorHandler = require('./middleware/errorHandler');
const ApiError = require('./utils/APiError');

const cors = require("cors");

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5174",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => logger("MongoDB connected"))
  .catch((err) => logger("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

app.all(/.*/, (req, res, next) => {
    next(new ApiError(`Can't find this route ${req.originalUrl}`,404));
  });
    
app.use(errorHandler);
app.listen(process.env.PORT, () => {
  logger(`Server running on port ${process.env.PORT}`);
});
