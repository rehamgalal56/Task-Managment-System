const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const projectRoutes = require("./routes/project.routes");
const sectionRoutes = require("./routes/Section.routes");

const logger = require("./utils/logger");


dotenv.config();
const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => logger("MongoDB connected"))
  .catch((err) => logger("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/users", userRoutes);

app.listen(process.env.PORT, () => {
  logger(`Server running on port ${process.env.PORT}`);
});
