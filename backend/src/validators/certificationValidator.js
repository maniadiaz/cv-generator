const Joi = require('joi');

/**
 * Validador para crear certification
 */
const createCertificationSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(200)
    .required()
    .messages({
      'string.min': 'Certification name must be at least 2 characters',
      'string.max': 'Certification name must not exceed 200 characters',
      'any.required': 'Certification name is required'
    }),

  issuing_organization: Joi.string()
    .min(2)
    .max(200)
    .required()
    .messages({
      'string.min': 'Issuing organization must be at least 2 characters',
      'string.max': 'Issuing organization must not exceed 200 characters',
      'any.required': 'Issuing organization is required'
    }),

  issue_date: Joi.date()
    .required()
    .messages({
      'date.base': 'Issue date must be a valid date',
      'any.required': 'Issue date is required'
    }),

  expiration_date: Joi.date()
    .optional()
    .allow(null)
    .greater(Joi.ref('issue_date'))
    .messages({
      'date.base': 'Expiration date must be a valid date',
      'date.greater': 'Expiration date must be after issue date'
    }),

  does_not_expire: Joi.boolean()
    .optional(),

  credential_id: Joi.string()
    .max(100)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Credential ID must not exceed 100 characters'
    }),

  credential_url: Joi.string()
    .uri()
    .optional()
    .allow(null, '')
    .messages({
      'string.uri': 'Credential URL must be a valid URL'
    }),

  description: Joi.string()
    .max(2000)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Description must not exceed 2000 characters'
    }),

  is_visible: Joi.boolean()
    .optional()
});

/**
 * Validador para actualizar certification
 */
const updateCertificationSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(200)
    .optional()
    .messages({
      'string.min': 'Certification name must be at least 2 characters',
      'string.max': 'Certification name must not exceed 200 characters'
    }),

  issuing_organization: Joi.string()
    .min(2)
    .max(200)
    .optional()
    .messages({
      'string.min': 'Issuing organization must be at least 2 characters',
      'string.max': 'Issuing organization must not exceed 200 characters'
    }),

  issue_date: Joi.date()
    .optional()
    .messages({
      'date.base': 'Issue date must be a valid date'
    }),

  expiration_date: Joi.date()
    .optional()
    .allow(null)
    .messages({
      'date.base': 'Expiration date must be a valid date'
    }),

  does_not_expire: Joi.boolean()
    .optional(),

  credential_id: Joi.string()
    .max(100)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Credential ID must not exceed 100 characters'
    }),

  credential_url: Joi.string()
    .uri()
    .optional()
    .allow(null, '')
    .messages({
      'string.uri': 'Credential URL must be a valid URL'
    }),

  description: Joi.string()
    .max(2000)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Description must not exceed 2000 characters'
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
const certificationIdSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Certification ID must be a number',
      'number.integer': 'Certification ID must be an integer',
      'number.positive': 'Certification ID must be positive',
      'any.required': 'Certification ID is required'
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
  createCertificationSchema,
  updateCertificationSchema,
  reorderSchema,
  certificationIdSchema,
  profileIdSchema
};
