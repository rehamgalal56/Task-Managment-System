const Joi = require('joi');

const validateUserUpdate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().optional(),
    fullName: Joi.string().optional(),
    jobRole: Joi.string().optional(),
    gender: Joi.string().valid('male', 'female', 'other').optional(),
    birthDate: Joi.date().optional(),
    phoneNumber: Joi.string().optional(),
    aboutMe: Joi.string().max(500).optional(),
  });

  return schema.validate(data);
};

module.exports = { validateUserUpdate };
