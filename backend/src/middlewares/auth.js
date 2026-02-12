const tokenService = require('../services/tokenService');
const { User } = require('../models');
const ApiResponse = require('../utils/response');

/**
 * Middleware para verificar JWT y autenticar usuario
 */
const authenticate = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ApiResponse.unauthorized(res, 'No token provided');
    }

    const token = authHeader.substring(7); // Remover "Bearer "

    // Verificar token
    let decoded;
    try {
      decoded = tokenService.verifyAccessToken(token);
    } catch (error) {
      return ApiResponse.unauthorized(res, 'Invalid or expired token');
    }

    // Verificar que la sesión existe y está activa
    const session = await tokenService.getActiveSession(token);

    if (!session) {
      return ApiResponse.unauthorized(res, 'Session not found or expired');
    }

    // Verificar que la sesión no haya expirado
    if (session.isExpired()) {
      await session.revoke();
      return ApiResponse.unauthorized(res, 'Session expired');
    }

    // Buscar usuario
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return ApiResponse.unauthorized(res, 'User not found');
    }

    // Verificar que el usuario esté activo
    if (!user.is_active) {
      return ApiResponse.unauthorized(res, 'Account is deactivated');
    }

    // Agregar usuario y sesión al request
    req.user = user;
    req.session = session;
    req.token = token;

    // Actualizar última actividad de la sesión (no bloqueante)
    session.updateActivity().catch(() => {});

    next();
  } catch (error) {
    return ApiResponse.error(res, 'Authentication failed', 401);
  }
};

/**
 * Middleware opcional - no falla si no hay token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);

    try {
      const decoded = tokenService.verifyAccessToken(token);
      const user = await User.findByPk(decoded.userId);

      if (user && user.is_active) {
        req.user = user;
      }
    } catch (error) {
      // Ignorar errores en auth opcional
    }

    next();
  } catch (error) {
    next();
  }
};

/**
 * Middleware para verificar que el email esté verificado
 */
const requireVerified = (req, res, next) => {
  if (!req.user) {
    return ApiResponse.unauthorized(res, 'Authentication required');
  }

  if (!req.user.is_verified) {
    return ApiResponse.forbidden(res, 'Email verification required');
  }

  next();
};

/**
 * Middleware para verificar cuenta premium
 */
const requirePremium = (req, res, next) => {
  if (!req.user) {
    return ApiResponse.unauthorized(res, 'Authentication required');
  }

  if (!req.user.is_premium) {
    return ApiResponse.forbidden(res, 'Premium account required');
  }

  next();
};

module.exports = {
  authenticate,
  optionalAuth,
  requireVerified,
  requirePremium
};
