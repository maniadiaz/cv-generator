const Joi = require('joi');

/**
 * Validador para registro de usuario
 */
const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Must be a valid email address',
      'any.required': 'Email is required'
    }),

  password: Joi.string()
    .min(8)
    .max(100)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password must not exceed 100 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      'any.required': 'Password is required'
    }),

  first_name: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name must not exceed 100 characters'
    }),

  last_name: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name must not exceed 100 characters'
    })
});

/**
 * Validador para login
 */
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Must be a valid email address',
      'any.required': 'Email is required'
    }),

  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

/**
 * Validador para refresh token
 */
const refreshTokenSchema = Joi.object({
  refresh_token: Joi.string()
    .required()
    .messages({
      'any.required': 'Refresh token is required'
    })
});

/**
 * Validador para forgot password
 */
const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Must be a valid email address',
      'any.required': 'Email is required'
    })
});

/**
 * Validador para reset password
 */
const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'Reset token is required'
    }),

  password: Joi.string()
    .min(8)
    .max(100)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password must not exceed 100 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      'any.required': 'Password is required'
    })
});

/**
 * Validador para verificar email
 */
const verifyEmailSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'Verification token is required'
    })
});

/**
 * Validador para actualizar perfil
 */
const updateProfileSchema = Joi.object({
  first_name: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name must not exceed 100 characters'
    }),

  last_name: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name must not exceed 100 characters'
    }),

  avatar_url: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': 'Avatar URL must be a valid URL'
    })
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  updateProfileSchema
};
