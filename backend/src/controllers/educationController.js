const educationService = require('../services/educationService');
const ApiResponse = require('../utils/response');
const logger = require('../utils/logger');

class EducationController {
  /**
   * POST /api/profiles/:profileId/education
   * Crear nueva educación
   */
  async createEducation(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const educationData = req.body;

      const result = await educationService.createEducation(profileId, userId, educationData);

      return ApiResponse.created(res, {
        education: result.education
      }, result.message);

    } catch (error) {
      logger.error('Create education error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * GET /api/profiles/:profileId/education
   * Obtener todas las educaciones de un perfil
   */
  async getEducationsByProfile(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);

      const educations = await educationService.getEducationsByProfile(profileId, userId);

      return ApiResponse.success(res, {
        educations,
        count: educations.length
      }, 'Education list retrieved successfully');

    } catch (error) {
      logger.error('Get educations error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * GET /api/profiles/:profileId/education/:id
   * Obtener una educación específica
   */
  async getEducationById(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const educationId = parseInt(req.params.id);

      const education = await educationService.getEducationById(educationId, profileId, userId);

      return ApiResponse.success(res, {
        education
      }, 'Education retrieved successfully');

    } catch (error) {
      logger.error('Get education error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * PUT /api/profiles/:profileId/education/:id
   * Actualizar una educación
   */
  async updateEducation(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const educationId = parseInt(req.params.id);
      const updates = req.body;

      const result = await educationService.updateEducation(educationId, profileId, userId, updates);

      return ApiResponse.success(res, {
        education: result.education
      }, result.message);

    } catch (error) {
      logger.error('Update education error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * DELETE /api/profiles/:profileId/education/:id
   * Eliminar una educación
   */
  async deleteEducation(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const educationId = parseInt(req.params.id);

      const result = await educationService.deleteEducation(educationId, profileId, userId);

      return ApiResponse.success(res, null, result.message);

    } catch (error) {
      logger.error('Delete education error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * POST /api/profiles/:profileId/education/reorder
   * Reordenar educaciones
   */
  async reorderEducations(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const { ordered_ids } = req.body;

      const result = await educationService.reorderEducations(profileId, userId, ordered_ids);

      return ApiResponse.success(res, null, result.message);

    } catch (error) {
      logger.error('Reorder educations error:', error);

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
   * PATCH /api/profiles/:profileId/education/:id/toggle-visibility
   * Toggle visibility de educación
   */
  async toggleVisibility(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const educationId = parseInt(req.params.id);

      const result = await educationService.toggleVisibility(educationId, profileId, userId);

      return ApiResponse.success(res, {
        education: result.education
      }, result.message);

    } catch (error) {
      logger.error('Toggle education visibility error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * GET /api/profiles/:profileId/education/stats
   * Obtener estadísticas de educación
   */
  async getEducationStats(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);

      const stats = await educationService.getEducationStats(profileId, userId);

      return ApiResponse.success(res, {
        stats
      }, 'Education statistics retrieved successfully');

    } catch (error) {
      logger.error('Get education stats error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }
}

module.exports = new EducationController();
