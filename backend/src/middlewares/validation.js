const ApiResponse = require('../utils/response');

/**
 * Middleware para validar request body con esquema Joi
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Retornar todos los errores
      stripUnknown: true // Remover campos no definidos en el schema
    });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      return ApiResponse.badRequest(res, 'Validation failed', errors);
    }

    // Reemplazar body con el valor validado
    req.body = value;
    next();
  };
};

/**
 * Middleware para validar query params
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      return ApiResponse.badRequest(res, 'Query validation failed', errors);
    }

    req.query = value;
    next();
  };
};

/**
 * Middleware para validar params de ruta
 */
const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      return ApiResponse.badRequest(res, 'Params validation failed', errors);
    }

    req.params = value;
    next();
  };
};

module.exports = {
  validate,
  validateQuery,
  validateParams
};
