const Joi = require('joi');

/**
 * Validador para parámetros de profileId en rutas de PDF
 */
const profileIdSchema = Joi.object({
  profileId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Profile ID must be a number',
      'number.integer': 'Profile ID must be an integer',
      'number.positive': 'Profile ID must be positive',
      'any.required': 'Profile ID is required'
    })
});

module.exports = {
  profileIdSchema
};
