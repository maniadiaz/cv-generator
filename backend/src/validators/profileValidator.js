const Joi = require('joi');
const { getValidSchemeIds } = require('../config/colorSchemes');

/**
 * Validador para crear perfil
 */
const createProfileSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Profile name must be at least 2 characters',
      'string.max': 'Profile name must not exceed 100 characters',
      'any.required': 'Profile name is required'
    }),

  template: Joi.string()
    .valid('harvard_classic', 'harvard_modern', 'oxford', 'ats')
    .optional()
    .messages({
      'any.only': 'Template must be one of: harvard_classic, harvard_modern, oxford, ats'
    }),

  language: Joi.string()
    .valid('es', 'en')
    .optional()
    .messages({
      'any.only': 'Language must be either es or en'
    }),

  color_scheme: Joi.string()
    .valid(...getValidSchemeIds())
    .optional()
    .messages({
      'any.only': `Color scheme must be one of: ${getValidSchemeIds().join(', ')}`
    }),

  is_default: Joi.boolean()
    .optional(),

  personalInfo: Joi.object({
    full_name: Joi.string()
      .min(2)
      .max(200)
      .required()
      .messages({
        'string.min': 'Full name must be at least 2 characters',
        'string.max': 'Full name must not exceed 200 characters',
        'any.required': 'Full name is required'
      }),

    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Must be a valid email address',
        'any.required': 'Email is required'
      }),

    phone: Joi.string()
      .max(20)
      .optional()
      .messages({
        'string.max': 'Phone must not exceed 20 characters'
      }),

    location: Joi.string()
      .max(200)
      .optional()
      .messages({
        'string.max': 'Location must not exceed 200 characters'
      }),

    website: Joi.string()
      .uri()
      .optional()
      .messages({
        'string.uri': 'Website must be a valid URL'
      }),

    linkedin: Joi.string()
      .uri()
      .optional()
      .messages({
        'string.uri': 'LinkedIn URL must be valid'
      }),

    github: Joi.string()
      .uri()
      .optional()
      .messages({
        'string.uri': 'GitHub URL must be valid'
      }),

    twitter: Joi.string()
      .uri()
      .optional()
      .messages({
        'string.uri': 'Twitter URL must be valid'
      }),

    professional_title: Joi.string()
      .max(200)
      .optional()
      .messages({
        'string.max': 'Professional title must not exceed 200 characters'
      }),

    summary: Joi.string()
      .max(5000)
      .optional()
      .messages({
        'string.max': 'Summary must not exceed 5000 characters'
      })
  }).optional()
});

/**
 * Validador para actualizar perfil
 */
const updateProfileSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Profile name must be at least 2 characters',
      'string.max': 'Profile name must not exceed 100 characters'
    }),

  template: Joi.string()
    .valid('harvard_classic', 'harvard_modern', 'oxford', 'ats')
    .optional()
    .messages({
      'any.only': 'Template must be one of: harvard_classic, harvard_modern, oxford, ats'
    }),

  language: Joi.string()
    .valid('es', 'en')
    .optional()
    .messages({
      'any.only': 'Language must be either es or en'
    }),

  color_scheme: Joi.string()
    .valid(...getValidSchemeIds())
    .optional()
    .messages({
      'any.only': `Color scheme must be one of: ${getValidSchemeIds().join(', ')}`
    }),

  is_public: Joi.boolean()
    .optional()
});

/**
 * Validador para información personal
 */
const personalInfoSchema = Joi.object({
  full_name: Joi.string()
    .min(2)
    .max(200)
    .optional()
    .messages({
      'string.min': 'Full name must be at least 2 characters',
      'string.max': 'Full name must not exceed 200 characters'
    }),

  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Must be a valid email address'
    }),

  phone: Joi.string()
    .max(20)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Phone must not exceed 20 characters'
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

  linkedin: Joi.string()
    .uri()
    .optional()
    .allow(null, '')
    .messages({
      'string.uri': 'LinkedIn URL must be valid'
    }),

  github: Joi.string()
    .uri()
    .optional()
    .allow(null, '')
    .messages({
      'string.uri': 'GitHub URL must be valid'
    }),

  twitter: Joi.string()
    .uri()
    .optional()
    .allow(null, '')
    .messages({
      'string.uri': 'Twitter URL must be valid'
    }),

  professional_title: Joi.string()
    .max(200)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Professional title must not exceed 200 characters'
    }),

  summary: Joi.string()
    .max(5000)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Summary must not exceed 5000 characters'
    }),

  birth_date: Joi.date()
    .optional()
    .allow(null)
    .messages({
      'date.base': 'Birth date must be a valid date'
    }),

  nationality: Joi.string()
    .max(100)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Nationality must not exceed 100 characters'
    }),

  marital_status: Joi.string()
    .valid('single', 'married', 'divorced', 'widowed', 'other')
    .optional()
    .allow(null)
    .messages({
      'any.only': 'Marital status must be one of: single, married, divorced, widowed, other'
    }),

  driving_license: Joi.string()
    .max(50)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Driving license must not exceed 50 characters'
    }),

  profile_photo_url: Joi.string()
    .uri()
    .optional()
    .allow(null, '')
    .messages({
      'string.uri': 'Profile photo URL must be valid'
    }),

  address_line1: Joi.string()
    .max(255)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Address line 1 must not exceed 255 characters'
    }),

  address_line2: Joi.string()
    .max(255)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Address line 2 must not exceed 255 characters'
    }),

  city: Joi.string()
    .max(100)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'City must not exceed 100 characters'
    }),

  state: Joi.string()
    .max(100)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'State must not exceed 100 characters'
    }),

  postal_code: Joi.string()
    .max(20)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Postal code must not exceed 20 characters'
    }),

  country: Joi.string()
    .max(100)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Country must not exceed 100 characters'
    })
});

/**
 * Validador para parámetros de ID
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
  createProfileSchema,
  updateProfileSchema,
  personalInfoSchema,
  profileIdSchema
};
