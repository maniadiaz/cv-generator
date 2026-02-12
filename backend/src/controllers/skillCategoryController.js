const ApiResponse = require('../utils/response');
const { SKILL_CATEGORIES, getCategoriesGrouped } = require('../config/skillCategories');

/**
 * Obtener todas las categorías de skills disponibles
 * GET /api/skills/categories
 */
const getAllCategories = async (req, res) => {
  try {
    return ApiResponse.success(
      res,
      {
        categories: SKILL_CATEGORIES,
        total: SKILL_CATEGORIES.length
      },
      'Skill categories retrieved successfully'
    );
  } catch (error) {
    return ApiResponse.error(res, error.message, 500);
  }
};

/**
 * Obtener categorías agrupadas por tema
 * GET /api/skills/categories/grouped
 */
const getCategoriesGroupedByTheme = async (req, res) => {
  try {
    const grouped = getCategoriesGrouped();

    return ApiResponse.success(
      res,
      {
        categoriesGrouped: grouped,
        totalGroups: Object.keys(grouped).length
      },
      'Grouped skill categories retrieved successfully'
    );
  } catch (error) {
    return ApiResponse.error(res, error.message, 500);
  }
};

module.exports = {
  getAllCategories,
  getCategoriesGroupedByTheme
};
