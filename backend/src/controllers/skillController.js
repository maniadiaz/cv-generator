const skillService = require('../services/skillService');
const ApiResponse = require('../utils/response');
const logger = require('../utils/logger');

class SkillController {
  /**
   * POST /api/profiles/:profileId/skills
   * Crear nuevo skill
   */
  async create(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const skillData = req.body;

      const result = await skillService.createSkill(profileId, userId, skillData);

      return ApiResponse.created(res, {
        skill: result.skill
      }, result.message);

    } catch (error) {
      logger.error('Create skill error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * GET /api/profiles/:profileId/skills
   * Obtener todos los skills de un perfil
   */
  async getByProfile(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);

      const skills = await skillService.getSkillsByProfile(profileId, userId);

      return ApiResponse.success(res, {
        skills,
        count: skills.length
      }, 'Skills list retrieved successfully');

    } catch (error) {
      logger.error('Get skills error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * GET /api/profiles/:profileId/skills/:id
   * Obtener un skill específico
   */
  async getById(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const skillId = parseInt(req.params.id);

      const skill = await skillService.getSkillById(skillId, profileId, userId);

      return ApiResponse.success(res, {
        skill
      }, 'Skill retrieved successfully');

    } catch (error) {
      logger.error('Get skill error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * PUT /api/profiles/:profileId/skills/:id
   * Actualizar un skill
   */
  async update(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const skillId = parseInt(req.params.id);
      const updates = req.body;

      const result = await skillService.updateSkill(skillId, profileId, userId, updates);

      return ApiResponse.success(res, {
        skill: result.skill
      }, result.message);

    } catch (error) {
      logger.error('Update skill error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * DELETE /api/profiles/:profileId/skills/:id
   * Eliminar un skill
   */
  async delete(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const skillId = parseInt(req.params.id);

      const result = await skillService.deleteSkill(skillId, profileId, userId);

      return ApiResponse.success(res, null, result.message);

    } catch (error) {
      logger.error('Delete skill error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * POST /api/profiles/:profileId/skills/reorder
   * Reordenar skills
   */
  async reorder(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const { ordered_ids } = req.body;

      const result = await skillService.reorderSkills(profileId, userId, ordered_ids);

      return ApiResponse.success(res, null, result.message);

    } catch (error) {
      logger.error('Reorder skills error:', error);

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
   * PATCH /api/profiles/:profileId/skills/:id/toggle-visibility
   * Toggle visibility de skill
   */
  async toggleVisibility(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);
      const skillId = parseInt(req.params.id);

      const result = await skillService.toggleVisibility(skillId, profileId, userId);

      return ApiResponse.success(res, {
        skill: result.skill
      }, result.message);

    } catch (error) {
      logger.error('Toggle skill visibility error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * GET /api/profiles/:profileId/skills/stats
   * Obtener estadísticas de skills
   */
  async getStats(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);

      const stats = await skillService.getSkillStats(profileId, userId);

      return ApiResponse.success(res, {
        stats
      }, 'Skill statistics retrieved successfully');

    } catch (error) {
      logger.error('Get skill stats error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }
}

module.exports = new SkillController();
