const { Profile } = require('../models');
const ApiResponse = require('../utils/response');
const logger = require('../utils/logger');

/**
 * Middleware para verificar que el perfil pertenece al usuario autenticado
 *
 * Debe usarse después del middleware authenticate
 * Busca el profileId en req.params.id o req.params.profileId
 */
const verifyProfileOwnership = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profileId = parseInt(req.params.id || req.params.profileId);

    if (!profileId || isNaN(profileId)) {
      return ApiResponse.badRequest(res, 'Invalid profile ID');
    }

    // Buscar el perfil
    const profile = await Profile.findOne({
      where: {
        id: profileId,
        user_id: userId
      }
    });

    if (!profile) {
      logger.warn(`User ${userId} attempted to access profile ${profileId} without permission`);
      return ApiResponse.notFound(res, 'Profile not found or access denied');
    }

    // Agregar el perfil al request para evitar consultas duplicadas
    req.profile = profile;

    next();

  } catch (error) {
    logger.error('Profile ownership verification error:', error);
    return ApiResponse.error(res, 'Failed to verify profile ownership', 500);
  }
};

/**
 * Middleware opcional para verificar ownership
 * Si el perfil no existe o no pertenece al usuario, continúa sin error
 * Útil para endpoints públicos que pueden o no tener ownership
 */
const verifyProfileOwnershipOptional = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const profileId = parseInt(req.params.id || req.params.profileId);

    if (!profileId || isNaN(profileId) || !userId) {
      return next();
    }

    const profile = await Profile.findOne({
      where: {
        id: profileId,
        user_id: userId
      }
    });

    if (profile) {
      req.profile = profile;
      req.isOwner = true;
    } else {
      req.isOwner = false;
    }

    next();

  } catch (error) {
    logger.error('Optional profile ownership verification error:', error);
    req.isOwner = false;
    next();
  }
};

module.exports = {
  verifyProfileOwnership,
  verifyProfileOwnershipOptional
};
