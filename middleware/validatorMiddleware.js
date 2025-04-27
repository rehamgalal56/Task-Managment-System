const ApiError = require('../utils/APiError');
const validatorMiddleware = (schema) => {
  return (req, res, next) => {
    const { error } = schema(req.body);
    
    if (error) { 
      return next(new ApiError(error.message, 400)); 
    }
    next(); 
  };
};


module.exports =  validatorMiddleware ;
