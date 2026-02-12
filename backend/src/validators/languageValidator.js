const Joi = require('joi');

/**
 * Validador para crear language
 */
const createLanguageSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Language name must be at least 2 characters',
      'string.max': 'Language name must not exceed 100 characters',
      'any.required': 'Language name is required'
    }),

  proficiency_level: Joi.string()
    .valid('native', 'fluent', 'advanced', 'intermediate', 'basic')
    .required()
    .messages({
      'any.only': 'Proficiency level must be one of: native, fluent, advanced, intermediate, basic',
      'any.required': 'Proficiency level is required'
    }),

  cefr_level: Joi.string()
    .valid('A1', 'A2', 'B1', 'B2', 'C1', 'C2')
    .optional()
    .allow(null)
    .messages({
      'any.only': 'CEFR level must be one of: A1, A2, B1, B2, C1, C2'
    }),

  can_read: Joi.boolean()
    .optional(),

  can_write: Joi.boolean()
    .optional(),

  can_speak: Joi.boolean()
    .optional(),

  is_visible: Joi.boolean()
    .optional()
});

/**
 * Validador para actualizar language
 */
const updateLanguageSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Language name must be at least 2 characters',
      'string.max': 'Language name must not exceed 100 characters'
    }),

  proficiency_level: Joi.string()
    .valid('native', 'fluent', 'advanced', 'intermediate', 'basic')
    .optional()
    .messages({
      'any.only': 'Proficiency level must be one of: native, fluent, advanced, intermediate, basic'
    }),

  cefr_level: Joi.string()
    .valid('A1', 'A2', 'B1', 'B2', 'C1', 'C2')
    .optional()
    .allow(null)
    .messages({
      'any.only': 'CEFR level must be one of: A1, A2, B1, B2, C1, C2'
    }),

  can_read: Joi.boolean()
    .optional(),

  can_write: Joi.boolean()
    .optional(),

  can_speak: Joi.boolean()
    .optional(),

  is_visible: Joi.boolean()
    .optional()
});

/**
 * Validador para reordenar
 */
const reorderSchema = Joi.object({
  ordered_ids: Joi.array()
    .items(Joi.number().integer().positive())
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one ID is required',
      'any.required': 'Ordered IDs are required'
    })
});

/**
 * Validador para parámetros de ID
 */
const languageIdSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Language ID must be a number',
      'number.integer': 'Language ID must be an integer',
      'number.positive': 'Language ID must be positive',
      'any.required': 'Language ID is required'
    }),
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

/**
 * Validador para profile ID
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
  createLanguageSchema,
  updateLanguageSchema,
  reorderSchema,
  languageIdSchema,
  profileIdSchema
};
