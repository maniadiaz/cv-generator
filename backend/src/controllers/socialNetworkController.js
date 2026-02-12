const socialNetworkService = require('../services/socialNetworkService');
const ApiResponse = require('../utils/response');
const logger = require('../utils/logger');

class SocialNetworkController {
  /**
   * POST /api/profiles/:profileId/social-networks
   * Crear nueva red social
   */
  async createSocialNetwork(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const socialNetworkData = req.body;

      const result = await socialNetworkService.createSocialNetwork(profileId, userId, socialNetworkData);

      return ApiResponse.created(res, {
        socialNetwork: result.socialNetwork
      }, result.message);

    } catch (error) {
      logger.error('Create social network error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * GET /api/profiles/:profileId/social-networks
   * Obtener todas las redes sociales de un perfil
   */
  async getSocialNetworksByProfile(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);

      const socialNetworks = await socialNetworkService.getSocialNetworksByProfile(profileId, userId);

      return ApiResponse.success(res, {
        socialNetworks,
        count: socialNetworks.length
      }, 'Social networks list retrieved successfully');

    } catch (error) {
      logger.error('Get social networks error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * GET /api/profiles/:profileId/social-networks/:id
   * Obtener una red social específica
   */
  async getSocialNetworkById(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const socialNetworkId = parseInt(req.params.id);

      const socialNetwork = await socialNetworkService.getSocialNetworkById(socialNetworkId, profileId, userId);

      return ApiResponse.success(res, {
        socialNetwork
      }, 'Social network retrieved successfully');

    } catch (error) {
      logger.error('Get social network error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * PUT /api/profiles/:profileId/social-networks/:id
   * Actualizar una red social
   */
  async updateSocialNetwork(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const socialNetworkId = parseInt(req.params.id);
      const updates = req.body;

      const result = await socialNetworkService.updateSocialNetwork(socialNetworkId, profileId, userId, updates);

      return ApiResponse.success(res, {
        socialNetwork: result.socialNetwork
      }, result.message);

    } catch (error) {
      logger.error('Update social network error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * DELETE /api/profiles/:profileId/social-networks/:id
   * Eliminar una red social
   */
  async deleteSocialNetwork(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const socialNetworkId = parseInt(req.params.id);

      const result = await socialNetworkService.deleteSocialNetwork(socialNetworkId, profileId, userId);

      return ApiResponse.success(res, null, result.message);

    } catch (error) {
      logger.error('Delete social network error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * POST /api/profiles/:profileId/social-networks/reorder
   * Reordenar redes sociales
   */
  async reorderSocialNetworks(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const { ordered_ids } = req.body;

      const result = await socialNetworkService.reorderSocialNetworks(profileId, userId, ordered_ids);

      return ApiResponse.success(res, null, result.message);

    } catch (error) {
      logger.error('Reorder social networks error:', error);

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
   * PATCH /api/profiles/:profileId/social-networks/:id/toggle-visibility
   * Toggle visibility de red social
   */
  async toggleVisibility(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const socialNetworkId = parseInt(req.params.id);

      const result = await socialNetworkService.toggleVisibility(socialNetworkId, profileId, userId);

      return ApiResponse.success(res, {
        socialNetwork: result.socialNetwork
      }, result.message);

    } catch (error) {
      logger.error('Toggle social network visibility error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * GET /api/profiles/:profileId/social-networks/stats
   * Obtener estadísticas de redes sociales
   */
  async getSocialNetworkStats(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);

      const stats = await socialNetworkService.getSocialNetworkStats(profileId, userId);

      return ApiResponse.success(res, {
        stats
      }, 'Social network statistics retrieved successfully');

    } catch (error) {
      logger.error('Get social network stats error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }
}

module.exports = new SocialNetworkController();
