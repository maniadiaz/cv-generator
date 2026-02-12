const Joi = require('joi');

/**
 * Validador para crear experiencia
 */
const createExperienceSchema = Joi.object({
  project_title: Joi.string()
    .min(2)
    .max(200)
    .required()
    .messages({
      'string.min': 'Project title must be at least 2 characters',
      'string.max': 'Project title must not exceed 200 characters',
      'any.required': 'Project title is required'
    }),

  position: Joi.string()
    .min(2)
    .max(200)
    .required()
    .messages({
      'string.min': 'Position must be at least 2 characters',
      'string.max': 'Position must not exceed 200 characters',
      'any.required': 'Position is required'
    }),

  company: Joi.string()
    .max(200)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Company name must not exceed 200 characters'
    }),

  company_website: Joi.string()
    .uri()
    .optional()
    .allow(null, '')
    .messages({
      'string.uri': 'Company website must be a valid URL'
    }),

  employment_type: Joi.string()
    .valid('full_time', 'part_time', 'freelance', 'contract', 'internship', 'volunteer', 'self_employed')
    .optional()
    .allow(null)
    .messages({
      'any.only': 'Employment type must be one of: full_time, part_time, freelance, contract, internship, volunteer, self_employed'
    }),

  location: Joi.string()
    .max(200)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Location must not exceed 200 characters'
    }),

  location_type: Joi.string()
    .valid('onsite', 'remote', 'hybrid')
    .optional()
    .allow(null)
    .messages({
      'any.only': 'Location type must be one of: onsite, remote, hybrid'
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

  description: Joi.string()
    .max(5000)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Description must not exceed 5000 characters'
    }),

  achievements: Joi.alternatives()
    .try(
      Joi.string().max(10000),
      Joi.array().items(Joi.string())
    )
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Achievements must not exceed 10000 characters'
    }),

  technologies: Joi.alternatives()
    .try(
      Joi.string().max(5000),
      Joi.array().items(Joi.string())
    )
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Technologies must not exceed 5000 characters'
    }),

  project_url: Joi.string()
    .uri()
    .optional()
    .allow(null, '')
    .messages({
      'string.uri': 'Project URL must be a valid URL'
    }),

  is_visible: Joi.boolean()
    .optional()
});

/**
 * Validador para actualizar experiencia
 */
const updateExperienceSchema = Joi.object({
  project_title: Joi.string()
    .min(2)
    .max(200)
    .optional()
    .messages({
      'string.min': 'Project title must be at least 2 characters',
      'string.max': 'Project title must not exceed 200 characters'
    }),

  position: Joi.string()
    .min(2)
    .max(200)
    .optional()
    .messages({
      'string.min': 'Position must be at least 2 characters',
      'string.max': 'Position must not exceed 200 characters'
    }),

  company: Joi.string()
    .max(200)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Company name must not exceed 200 characters'
    }),

  company_website: Joi.string()
    .uri()
    .optional()
    .allow(null, '')
    .messages({
      'string.uri': 'Company website must be a valid URL'
    }),

  employment_type: Joi.string()
    .valid('full_time', 'part_time', 'freelance', 'contract', 'internship', 'volunteer', 'self_employed')
    .optional()
    .allow(null)
    .messages({
      'any.only': 'Employment type must be one of: full_time, part_time, freelance, contract, internship, volunteer, self_employed'
    }),

  location: Joi.string()
    .max(200)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Location must not exceed 200 characters'
    }),

  location_type: Joi.string()
    .valid('onsite', 'remote', 'hybrid')
    .optional()
    .allow(null)
    .messages({
      'any.only': 'Location type must be one of: onsite, remote, hybrid'
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

  description: Joi.string()
    .max(5000)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Description must not exceed 5000 characters'
    }),

  achievements: Joi.alternatives()
    .try(
      Joi.string().max(10000),
      Joi.array().items(Joi.string())
    )
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Achievements must not exceed 10000 characters'
    }),

  technologies: Joi.alternatives()
    .try(
      Joi.string().max(5000),
      Joi.array().items(Joi.string())
    )
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Technologies must not exceed 5000 characters'
    }),

  project_url: Joi.string()
    .uri()
    .optional()
    .allow(null, '')
    .messages({
      'string.uri': 'Project URL must be a valid URL'
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
const experienceIdSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Experience ID must be a number',
      'number.integer': 'Experience ID must be an integer',
      'number.positive': 'Experience ID must be positive',
      'any.required': 'Experience ID is required'
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
  createExperienceSchema,
  updateExperienceSchema,
  reorderSchema,
  experienceIdSchema,
  profileIdSchema
};
