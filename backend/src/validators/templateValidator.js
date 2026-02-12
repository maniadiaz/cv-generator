const Joi = require('joi');

/**
 * Validador para cambiar plantilla
 */
const changeTemplateSchema = Joi.object({
  template: Joi.string()
    .valid('harvard_classic', 'harvard_modern', 'oxford', 'ats')
    .required()
    .messages({
      'any.only': 'Template must be one of: harvard_classic, harvard_modern, oxford, ats',
      'any.required': 'Template is required'
    })
});

/**
 * Validador para parámetros de ID de perfil
 */
const profileIdSchema = Joi.object({
  id: Joi.number()
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
  changeTemplateSchema,
  profileIdSchema
};
