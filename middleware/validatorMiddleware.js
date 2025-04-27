const validatorMiddleware = (schema) => {
  return (req, res, next) => {
    const { error } = schema(req.body);

    if (error) {
      const errors = error.message;
      return res.status(400).json({ errors });
    }

    next();
  };
};

module.exports = validatorMiddleware;
