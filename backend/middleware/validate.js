const Joi = require('joi');
const AppError = require('../utils/AppError');

const validate = (schema, source = 'body') =>
  (req, res, next) => {
    const { error, value } = schema.validate(req[source], { abortEarly: false, stripUnknown: true });
    if (error) {
      const fields = error.details.map((d) => d.message);
      return next(new AppError('Validation failed for request data.', 400, 'VALIDATION_ERROR', { fields }));
    }
    req[source] = value;
    return next();
  };

const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(128).required(),
    role: Joi.string().valid('student', 'teacher').optional(),
    applyInstructor: Joi.boolean().optional()
  }),

  registerPhone: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    phone: Joi.string().pattern(/^\+[1-9]\d{7,14}$/).required().messages({
      'string.pattern.base': 'Telefon numarası +90XXXXXXXXXX formatında olmalıdır.'
    }),
    password: Joi.string().min(8).max(128).required(),
    applyInstructor: Joi.boolean().optional()
  }),

  sendPhoneOtp: Joi.object({
    phone: Joi.string().pattern(/^\+[1-9]\d{7,14}$/).required().messages({
      'string.pattern.base': 'Telefon numarası +90XXXXXXXXXX formatında olmalıdır.'
    }),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

module.exports = { validate, schemas };
