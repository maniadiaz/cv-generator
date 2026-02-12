const profileService = require('../services/profileService');
const profileCompletionService = require('../services/profileCompletionService');
const ApiResponse = require('../utils/response');
const logger = require('../utils/logger');

class ProfileController {
  /**
   * POST /api/profiles
   * Crear nuevo perfil
   */
  async createProfile(req, res) {
    try {
      const userId = req.user.id;
      const profileData = req.body;

      const result = await profileService.createProfile(userId, profileData);

      return ApiResponse.created(res, {
        profile: result.profile
      }, result.message);

    } catch (error) {
      logger.error('Create profile error:', error);
      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * GET /api/profiles
   * Obtener todos los perfiles del usuario autenticado
   */
  async getUserProfiles(req, res) {
    try {
      const userId = req.user.id;

      const profiles = await profileService.getUserProfiles(userId);

      return ApiResponse.success(res, {
        profiles,
        count: profiles.length
      }, 'Profiles retrieved successfully');

    } catch (error) {
      logger.error('Get user profiles error:', error);
      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * GET /api/profiles/:id
   * Obtener un perfil específico
   */
  async getProfileById(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.id);

      const profile = await profileService.getProfileById(profileId, userId);

      return ApiResponse.success(res, {
        profile
      }, 'Profile retrieved successfully');

    } catch (error) {
      logger.error('Get profile error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * PUT /api/profiles/:id
   * Actualizar un perfil
   */
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.id);
      const updates = req.body;

      const profile = await profileService.updateProfile(profileId, userId, updates);

      return ApiResponse.success(res, {
        profile
      }, 'Profile updated successfully');

    } catch (error) {
      logger.error('Update profile error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * DELETE /api/profiles/:id
   * Eliminar un perfil
   */
  async deleteProfile(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.id);

      const result = await profileService.deleteProfile(profileId, userId);

      return ApiResponse.success(res, null, result.message);

    } catch (error) {
      logger.error('Delete profile error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * PATCH /api/profiles/:id/set-default
   * Marcar perfil como default
   */
  async setDefaultProfile(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.id);

      const result = await profileService.setDefaultProfile(profileId, userId);

      return ApiResponse.success(res, {
        profile: result.profile
      }, result.message);

    } catch (error) {
      logger.error('Set default profile error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * GET /api/profiles/:id/complete
   * Obtener perfil completo con todas las relaciones
   */
  async getCompleteProfile(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.id);

      const profile = await profileService.getCompleteProfile(profileId, userId);

      return ApiResponse.success(res, {
        profile
      }, 'Complete profile retrieved successfully');

    } catch (error) {
      logger.error('Get complete profile error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * POST /api/profiles/:id/duplicate
   * Duplicar un perfil existente
   */
  async duplicateProfile(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.id);

      const result = await profileService.duplicateProfile(profileId, userId);

      return ApiResponse.created(res, {
        profile: result.profile
      }, result.message);

    } catch (error) {
      logger.error('Duplicate profile error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * GET /api/profiles/stats
   * Obtener estadísticas de perfiles
   */
  async getProfileStats(req, res) {
    try {
      const userId = req.user.id;

      const stats = await profileService.getProfileStats(userId);

      return ApiResponse.success(res, {
        stats
      }, 'Profile statistics retrieved successfully');

    } catch (error) {
      logger.error('Get profile stats error:', error);
      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * PUT /api/profiles/:id/personal
   * Actualizar información personal del perfil
   */
  async updatePersonalInfo(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.id);
      const personalInfoData = req.body;

      const result = await profileService.updatePersonalInfo(profileId, userId, personalInfoData);

      return ApiResponse.success(res, {
        personalInfo: result.personalInfo,
        completionPercentage: result.completionPercentage
      }, result.message);

    } catch (error) {
      logger.error('Update personal info error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * GET /api/profiles/:id/personal
   * Obtener información personal del perfil
   */
  async getPersonalInfo(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.id);

      const personalInfo = await profileService.getPersonalInfo(profileId, userId);

      return ApiResponse.success(res, {
        personalInfo
      }, 'Personal information retrieved successfully');

    } catch (error) {
      logger.error('Get personal info error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * GET /api/profiles/:id/completion
   * Obtener porcentaje de completitud y secciones faltantes
   */
  async getProfileCompletion(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.id);

      const completion = await profileCompletionService.getProfileCompletion(profileId, userId);

      return ApiResponse.success(res, {
        completion
      }, 'Profile completion retrieved successfully');

    } catch (error) {
      logger.error('Get profile completion error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }
}

module.exports = new ProfileController();
