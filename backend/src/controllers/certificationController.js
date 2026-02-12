const certificationService = require('../services/certificationService');
const ApiResponse = require('../utils/response');
const logger = require('../utils/logger');

class CertificationController {
  /**
   * POST /api/profiles/:profileId/certifications
   * Crear nueva certification
   */
  async create(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const certificationData = req.body;

      const result = await certificationService.createCertification(profileId, userId, certificationData);

      return ApiResponse.created(res, {
        certification: result.certification
      }, result.message);

    } catch (error) {
      logger.error('Create certification error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * GET /api/profiles/:profileId/certifications
   * Obtener todas las certifications de un perfil
   */
  async getByProfile(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);

      const certifications = await certificationService.getCertificationsByProfile(profileId, userId);

      return ApiResponse.success(res, {
        certifications,
        count: certifications.length
      }, 'Certifications list retrieved successfully');

    } catch (error) {
      logger.error('Get certifications error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * GET /api/profiles/:profileId/certifications/:id
   * Obtener una certification específica
   */
  async getById(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const certificationId = parseInt(req.params.id);

      const certification = await certificationService.getCertificationById(certificationId, profileId, userId);

      return ApiResponse.success(res, {
        certification
      }, 'Certification retrieved successfully');

    } catch (error) {
      logger.error('Get certification error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * PUT /api/profiles/:profileId/certifications/:id
   * Actualizar una certification
   */
  async update(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const certificationId = parseInt(req.params.id);
      const updates = req.body;

      const result = await certificationService.updateCertification(certificationId, profileId, userId, updates);

      return ApiResponse.success(res, {
        certification: result.certification
      }, result.message);

    } catch (error) {
      logger.error('Update certification error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * DELETE /api/profiles/:profileId/certifications/:id
   * Eliminar una certification
   */
  async delete(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const certificationId = parseInt(req.params.id);

      const result = await certificationService.deleteCertification(certificationId, profileId, userId);

      return ApiResponse.success(res, null, result.message);

    } catch (error) {
      logger.error('Delete certification error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * POST /api/profiles/:profileId/certifications/reorder
   * Reordenar certifications
   */
  async reorder(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const { ordered_ids } = req.body;

      const result = await certificationService.reorderCertifications(profileId, userId, ordered_ids);

      return ApiResponse.success(res, null, result.message);

    } catch (error) {
      logger.error('Reorder certifications error:', error);

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
   * PATCH /api/profiles/:profileId/certifications/:id/toggle-visibility
   * Toggle visibility de certification
   */
  async toggleVisibility(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const certificationId = parseInt(req.params.id);

      const result = await certificationService.toggleVisibility(certificationId, profileId, userId);

      return ApiResponse.success(res, {
        certification: result.certification
      }, result.message);

    } catch (error) {
      logger.error('Toggle certification visibility error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * GET /api/profiles/:profileId/certifications/stats
   * Obtener estadísticas de certifications
   */
  async getStats(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);

      const stats = await certificationService.getCertificationStats(profileId, userId);

      return ApiResponse.success(res, {
        stats
      }, 'Certification statistics retrieved successfully');

    } catch (error) {
      logger.error('Get certification stats error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }
}

module.exports = new CertificationController();
