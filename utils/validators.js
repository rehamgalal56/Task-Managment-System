exports.isUserInProject = (project, userId) => {
  return (
    project.userId.toString() === userId ||
    project.membersOfProject.some((memberId) => memberId.toString() === userId)
  );
};

exports.isProjectManager = (project, userId) => {
  return project.userId.toString() === userId;
};

