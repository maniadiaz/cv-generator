const experienceService = require('../services/experienceService');
const ApiResponse = require('../utils/response');
const logger = require('../utils/logger');

class ExperienceController {
  /**
   * POST /api/profiles/:profileId/experience
   * Crear nueva experiencia
   */
  async createExperience(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const experienceData = req.body;

      const result = await experienceService.createExperience(profileId, userId, experienceData);

      return ApiResponse.created(res, {
        experience: result.experience
      }, result.message);

    } catch (error) {
      logger.error('Create experience error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * GET /api/profiles/:profileId/experience
   * Obtener todas las experiencias de un perfil
   */
  async getExperiencesByProfile(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);

      const experiences = await experienceService.getExperiencesByProfile(profileId, userId);

      return ApiResponse.success(res, {
        experiences,
        count: experiences.length
      }, 'Experience list retrieved successfully');

    } catch (error) {
      logger.error('Get experiences error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * GET /api/profiles/:profileId/experience/:id
   * Obtener una experiencia específica
   */
  async getExperienceById(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const experienceId = parseInt(req.params.id);

      const experience = await experienceService.getExperienceById(experienceId, profileId, userId);

      return ApiResponse.success(res, {
        experience
      }, 'Experience retrieved successfully');

    } catch (error) {
      logger.error('Get experience error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * PUT /api/profiles/:profileId/experience/:id
   * Actualizar una experiencia
   */
  async updateExperience(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const experienceId = parseInt(req.params.id);
      const updates = req.body;

      const result = await experienceService.updateExperience(experienceId, profileId, userId, updates);

      return ApiResponse.success(res, {
        experience: result.experience
      }, result.message);

    } catch (error) {
      logger.error('Update experience error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * DELETE /api/profiles/:profileId/experience/:id
   * Eliminar una experiencia
   */
  async deleteExperience(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const experienceId = parseInt(req.params.id);

      const result = await experienceService.deleteExperience(experienceId, profileId, userId);

      return ApiResponse.success(res, null, result.message);

    } catch (error) {
      logger.error('Delete experience error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * POST /api/profiles/:profileId/experience/reorder
   * Reordenar experiencias
   */
  async reorderExperiences(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const { ordered_ids } = req.body;

      const result = await experienceService.reorderExperiences(profileId, userId, ordered_ids);

      return ApiResponse.success(res, null, result.message);

    } catch (error) {
      logger.error('Reorder experiences error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      if (error.message.includes('invalid')) {
        return ApiResponse.badRequest(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * PATCH /api/profiles/:profileId/experience/:id/toggle-visibility
   * Toggle visibility de experiencia
   */
  async toggleVisibility(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const experienceId = parseInt(req.params.id);

      const result = await experienceService.toggleVisibility(experienceId, profileId, userId);

      return ApiResponse.success(res, {
        experience: result.experience
      }, result.message);

    } catch (error) {
      logger.error('Toggle experience visibility error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * GET /api/profiles/:profileId/experience/stats
   * Obtener estadísticas de experiencia
   */
  async getExperienceStats(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);

      const stats = await experienceService.getExperienceStats(profileId, userId);

      return ApiResponse.success(res, {
        stats
      }, 'Experience statistics retrieved successfully');

    } catch (error) {
      logger.error('Get experience stats error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }
}

module.exports = new ExperienceController();
