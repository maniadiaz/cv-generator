const languageService = require('../services/languageService');
const ApiResponse = require('../utils/response');
const logger = require('../utils/logger');

class LanguageController {
  /**
   * POST /api/profiles/:profileId/languages
   * Crear nuevo language
   */
  async create(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const languageData = req.body;

      const result = await languageService.createLanguage(profileId, userId, languageData);

      return ApiResponse.created(res, {
        language: result.language
      }, result.message);

    } catch (error) {
      logger.error('Create language error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * GET /api/profiles/:profileId/languages
   * Obtener todos los languages de un perfil
   */
  async getByProfile(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);

      const languages = await languageService.getLanguagesByProfile(profileId, userId);

      return ApiResponse.success(res, {
        languages,
        count: languages.length
      }, 'Languages list retrieved successfully');

    } catch (error) {
      logger.error('Get languages error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * GET /api/profiles/:profileId/languages/:id
   * Obtener un language específico
   */
  async getById(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const languageId = parseInt(req.params.id);

      const language = await languageService.getLanguageById(languageId, profileId, userId);

      return ApiResponse.success(res, {
        language
      }, 'Language retrieved successfully');

    } catch (error) {
      logger.error('Get language error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * PUT /api/profiles/:profileId/languages/:id
   * Actualizar un language
   */
  async update(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const languageId = parseInt(req.params.id);
      const updates = req.body;

      const result = await languageService.updateLanguage(languageId, profileId, userId, updates);

      return ApiResponse.success(res, {
        language: result.language
      }, result.message);

    } catch (error) {
      logger.error('Update language error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * DELETE /api/profiles/:profileId/languages/:id
   * Eliminar un language
   */
  async delete(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const languageId = parseInt(req.params.id);

      const result = await languageService.deleteLanguage(languageId, profileId, userId);

      return ApiResponse.success(res, null, result.message);

    } catch (error) {
      logger.error('Delete language error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * POST /api/profiles/:profileId/languages/reorder
   * Reordenar languages
   */
  async reorder(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const { ordered_ids } = req.body;

      const result = await languageService.reorderLanguages(profileId, userId, ordered_ids);

      return ApiResponse.success(res, null, result.message);

    } catch (error) {
      logger.error('Reorder languages error:', error);

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
   * PATCH /api/profiles/:profileId/languages/:id/toggle-visibility
   * Toggle visibility de language
   */
  async toggleVisibility(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const languageId = parseInt(req.params.id);

      const result = await languageService.toggleVisibility(languageId, profileId, userId);

      return ApiResponse.success(res, {
        language: result.language
      }, result.message);

    } catch (error) {
      logger.error('Toggle language visibility error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * GET /api/profiles/:profileId/languages/stats
   * Obtener estadísticas de languages
   */
  async getStats(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);

      const stats = await languageService.getLanguageStats(profileId, userId);

      return ApiResponse.success(res, {
        stats
      }, 'Language statistics retrieved successfully');

    } catch (error) {
      logger.error('Get language stats error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }
}

module.exports = new LanguageController();
