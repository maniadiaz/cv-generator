const ApiResponse = require('../utils/response');
const logger = require('../utils/logger');
const {
  getAllColorSchemes,
  getColorSchemeById,
  getColorSchemesByCategory,
  getCategories
} = require('../config/colorSchemes');

class ColorSchemeController {
  /**
   * GET /api/color-schemes
   * Obtener todos los esquemas de colores disponibles
   */
  async getAllSchemes(req, res) {
    try {
      const schemes = getAllColorSchemes();

      return ApiResponse.success(res, {
        schemes,
        count: schemes.length
      }, 'Color schemes retrieved successfully');

    } catch (error) {
      logger.error('Error getting color schemes:', error);
      return ApiResponse.error(res, 'Failed to retrieve color schemes', 500);
    }
  }

  /**
   * GET /api/color-schemes/categories
   * Obtener esquemas agrupados por categoría
   */
  async getSchemesByCategory(req, res) {
    try {
      const categories = getCategories();
      const grouped = {};

      categories.forEach(category => {
        grouped[category] = getColorSchemesByCategory(category);
      });

      return ApiResponse.success(res, {
        categories: grouped,
        categoryCount: categories.length
      }, 'Color schemes by category retrieved successfully');

    } catch (error) {
      logger.error('Error getting color schemes by category:', error);
      return ApiResponse.error(res, 'Failed to retrieve color schemes by category', 500);
    }
  }

  /**
   * GET /api/color-schemes/:id
   * Obtener un esquema de color específico por ID
   */
  async getSchemeById(req, res) {
    try {
      const { id } = req.params;
      const scheme = getColorSchemeById(id);

      if (!scheme) {
        return ApiResponse.error(res, `Color scheme '${id}' not found`, 404);
      }

      return ApiResponse.success(res, {
        scheme
      }, 'Color scheme retrieved successfully');

    } catch (error) {
      logger.error('Error getting color scheme by id:', error);
      return ApiResponse.error(res, 'Failed to retrieve color scheme', 500);
    }
  }

  /**
   * GET /api/color-schemes/category/:category
   * Obtener esquemas de una categoría específica
   */
  async getSchemesByCategoryName(req, res) {
    try {
      const { category } = req.params;
      const schemes = getColorSchemesByCategory(category);

      if (schemes.length === 0) {
        return ApiResponse.error(res, `No color schemes found for category '${category}'`, 404);
      }

      return ApiResponse.success(res, {
        category,
        schemes,
        count: schemes.length
      }, `Color schemes for category '${category}' retrieved successfully`);

    } catch (error) {
      logger.error('Error getting color schemes by category name:', error);
      return ApiResponse.error(res, 'Failed to retrieve color schemes for category', 500);
    }
  }
}

module.exports = new ColorSchemeController();
