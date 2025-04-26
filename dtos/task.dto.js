class TaskDTO {
  constructor(task) {
    this.id = task._id;
    this.name = task.title;
    this.description = task.description;
    this.startDate = task.startDate || null;
    this.dueDate = task.dueDate || null;
    this.assigneeUsers = task.assignedTo
      ? Array.isArray(task.assignedTo)
        ? task.assignedTo.length > 0
          ? task.assignedTo.map((user) => ({
              userId: typeof user === "object" ? user._id : user,
              image: typeof user === "object" ? user.image || null : null,
            }))
          : null
        : [
            {
              userId:
                typeof task.assignedTo === "object"
                  ? task.assignedTo._id
                  : task.assignedTo,
              image:
                typeof task.assignedTo === "object"
                  ? task.assignedTo.image || null
                  : null,
            },
          ]
      : null;
    this.isCompleted = task.isCompleted || false;
  }
}

module.exports = TaskDTO;
