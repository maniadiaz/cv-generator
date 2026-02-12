const Joi = require('joi');
const { getCategoryValues } = require('../config/skillCategories');

// Obtener categorías válidas dinámicamente
const validCategories = getCategoryValues();

/**
 * Validador para crear skill
 */
const createSkillSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Skill name must be at least 2 characters',
      'string.max': 'Skill name must not exceed 100 characters',
      'any.required': 'Skill name is required'
    }),

  category: Joi.string()
    .valid(...validCategories)
    .required()
    .messages({
      'any.only': `Category must be one of: ${validCategories.join(', ')}`,
      'any.required': 'Category is required'
    }),

  proficiency_level: Joi.string()
    .valid('beginner', 'intermediate', 'advanced', 'expert')
    .required()
    .messages({
      'any.only': 'Proficiency level must be one of: beginner, intermediate, advanced, expert',
      'any.required': 'Proficiency level is required'
    }),

  years_of_experience: Joi.number()
    .integer()
    .min(0)
    .max(50)
    .optional()
    .allow(null)
    .messages({
      'number.base': 'Years of experience must be a number',
      'number.integer': 'Years of experience must be an integer',
      'number.min': 'Years of experience must be at least 0',
      'number.max': 'Years of experience must not exceed 50'
    }),

  is_visible: Joi.boolean()
    .optional()
});

/**
 * Validador para actualizar skill
 */
const updateSkillSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Skill name must be at least 2 characters',
      'string.max': 'Skill name must not exceed 100 characters'
    }),

  category: Joi.string()
    .valid(...validCategories)
    .optional()
    .messages({
      'any.only': `Category must be one of: ${validCategories.join(', ')}`
    }),

  proficiency_level: Joi.string()
    .valid('beginner', 'intermediate', 'advanced', 'expert')
    .optional()
    .messages({
      'any.only': 'Proficiency level must be one of: beginner, intermediate, advanced, expert'
    }),

  years_of_experience: Joi.number()
    .integer()
    .min(0)
    .max(50)
    .optional()
    .allow(null)
    .messages({
      'number.base': 'Years of experience must be a number',
      'number.integer': 'Years of experience must be an integer',
      'number.min': 'Years of experience must be at least 0',
      'number.max': 'Years of experience must not exceed 50'
    }),

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
const skillIdSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Skill ID must be a number',
      'number.integer': 'Skill ID must be an integer',
      'number.positive': 'Skill ID must be positive',
      'any.required': 'Skill ID is required'
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
  createSkillSchema,
  updateSkillSchema,
  reorderSchema,
  skillIdSchema,
  profileIdSchema
};
