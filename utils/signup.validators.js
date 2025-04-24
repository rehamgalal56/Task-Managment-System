
const Joi = require('joi');

const validateUserSignup = (data) => {
  const schema = Joi.object({

    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().required(),
    fullName: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports = { validateUserSignup };