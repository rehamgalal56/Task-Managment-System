// const APIError = require('../utils/APIError');

const errorHandler = (err, req, res, next) => {
  // If error doesn't have statusCode or status, set defaults
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = errorHandler;
