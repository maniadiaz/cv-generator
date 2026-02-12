const Joi = require('joi');

/**
 * Validador para crear educación
 */
const createEducationSchema = Joi.object({
  institution: Joi.string()
    .min(2)
    .max(200)
    .required()
    .messages({
      'string.min': 'Institution name must be at least 2 characters',
      'string.max': 'Institution name must not exceed 200 characters',
      'any.required': 'Institution name is required'
    }),

  degree: Joi.string()
    .min(2)
    .max(200)
    .required()
    .messages({
      'string.min': 'Degree must be at least 2 characters',
      'string.max': 'Degree must not exceed 200 characters',
      'any.required': 'Degree is required'
    }),

  field_of_study: Joi.string()
    .max(200)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Field of study must not exceed 200 characters'
    }),

  start_date: Joi.date()
    .required()
    .messages({
      'date.base': 'Start date must be a valid date',
      'any.required': 'Start date is required'
    }),

  end_date: Joi.date()
    .optional()
    .allow(null)
    .greater(Joi.ref('start_date'))
    .messages({
      'date.base': 'End date must be a valid date',
      'date.greater': 'End date must be after start date'
    }),

  is_current: Joi.boolean()
    .optional(),

  grade: Joi.string()
    .max(50)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Grade must not exceed 50 characters'
    }),

  description: Joi.string()
    .max(5000)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Description must not exceed 5000 characters'
    }),

  location: Joi.string()
    .max(200)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Location must not exceed 200 characters'
    }),

  website: Joi.string()
    .uri()
    .optional()
    .allow(null, '')
    .messages({
      'string.uri': 'Website must be a valid URL'
    }),

  is_visible: Joi.boolean()
    .optional()
});

/**
 * Validador para actualizar educación
 */
const updateEducationSchema = Joi.object({
  institution: Joi.string()
    .min(2)
    .max(200)
    .optional()
    .messages({
      'string.min': 'Institution name must be at least 2 characters',
      'string.max': 'Institution name must not exceed 200 characters'
    }),

  degree: Joi.string()
    .min(2)
    .max(200)
    .optional()
    .messages({
      'string.min': 'Degree must be at least 2 characters',
      'string.max': 'Degree must not exceed 200 characters'
    }),

  field_of_study: Joi.string()
    .max(200)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Field of study must not exceed 200 characters'
    }),

  start_date: Joi.date()
    .optional()
    .messages({
      'date.base': 'Start date must be a valid date'
    }),

  end_date: Joi.date()
    .optional()
    .allow(null)
    .messages({
      'date.base': 'End date must be a valid date'
    }),

  is_current: Joi.boolean()
    .optional(),

  grade: Joi.string()
    .max(50)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Grade must not exceed 50 characters'
    }),

  description: Joi.string()
    .max(5000)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Description must not exceed 5000 characters'
    }),

  location: Joi.string()
    .max(200)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Location must not exceed 200 characters'
    }),

  website: Joi.string()
    .uri()
    .optional()
    .allow(null, '')
    .messages({
      'string.uri': 'Website must be a valid URL'
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
const educationIdSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Education ID must be a number',
      'number.integer': 'Education ID must be an integer',
      'number.positive': 'Education ID must be positive',
      'any.required': 'Education ID is required'
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
  createEducationSchema,
  updateEducationSchema,
  reorderSchema,
  educationIdSchema,
  profileIdSchema
};
