const Joi = require('joi');

/**
 * Validador para crear red social
 */
const createSocialNetworkSchema = Joi.object({
  platform: Joi.string()
    .valid(
      'linkedin',
      'github',
      'gitlab',
      'twitter',
      'portfolio',
      'stackoverflow',
      'medium',
      'youtube',
      'behance',
      'dribbble',
      'other'
    )
    .required()
    .messages({
      'any.only': 'Platform must be one of: linkedin, github, gitlab, twitter, portfolio, stackoverflow, medium, youtube, behance, dribbble, other',
      'any.required': 'Platform is required'
    }),

  url: Joi.string()
    .uri()
    .required()
    .messages({
      'string.uri': 'URL must be a valid URL',
      'any.required': 'URL is required'
    }),

  username: Joi.string()
    .max(100)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Username must not exceed 100 characters'
    }),

  is_visible: Joi.boolean()
    .optional()
});

/**
 * Validador para actualizar red social
 */
const updateSocialNetworkSchema = Joi.object({
  platform: Joi.string()
    .valid(
      'linkedin',
      'github',
      'gitlab',
      'twitter',
      'portfolio',
      'stackoverflow',
      'medium',
      'youtube',
      'behance',
      'dribbble',
      'other'
    )
    .optional()
    .messages({
      'any.only': 'Platform must be one of: linkedin, github, gitlab, twitter, portfolio, stackoverflow, medium, youtube, behance, dribbble, other'
    }),

  url: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': 'URL must be a valid URL'
    }),

  username: Joi.string()
    .max(100)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Username must not exceed 100 characters'
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
const socialNetworkIdSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Social network ID must be a number',
      'number.integer': 'Social network ID must be an integer',
      'number.positive': 'Social network ID must be positive',
      'any.required': 'Social network ID is required'
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
  createSocialNetworkSchema,
  updateSocialNetworkSchema,
  reorderSchema,
  socialNetworkIdSchema,
  profileIdSchema
};
