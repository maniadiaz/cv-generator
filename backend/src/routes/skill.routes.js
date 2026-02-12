const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams para acceder a :profileId
const skillController = require('../controllers/skillController');
const skillCategoryController = require('../controllers/skillCategoryController');
const { authenticate } = require('../middlewares/auth');
const { validate, validateParams } = require('../middlewares/validation');
const {
  createSkillSchema,
  updateSkillSchema,
  reorderSchema,
  skillIdSchema,
  profileIdSchema
} = require('../validators/skillValidator');

/**
 * Todas las rutas requieren autenticación
 * Rutas base: /api/profiles/:profileId/skills
 */

/**
 * @route   GET /api/profiles/:profileId/skills/categories
 * @desc    Obtener todas las categorías de skills disponibles
 * @access  Private
 */
router.get('/categories', authenticate, skillCategoryController.getAllCategories);

/**
 * @route   GET /api/profiles/:profileId/skills/categories/grouped
 * @desc    Obtener categorías agrupadas por tema
 * @access  Private
 */
router.get('/categories/grouped', authenticate, skillCategoryController.getCategoriesGroupedByTheme);

/**
 * @route   GET /api/profiles/:profileId/skills/stats
 * @desc    Obtener estadísticas de skills
 * @access  Private
 */
router.get('/stats', authenticate, validateParams(profileIdSchema), skillController.getStats);

/**
 * @route   POST /api/profiles/:profileId/skills/reorder
 * @desc    Reordenar skills
 * @access  Private
 */
router.post(
  '/reorder',
  authenticate,
  validateParams(profileIdSchema),
  validate(reorderSchema),
  skillController.reorder
);

/**
 * @route   GET /api/profiles/:profileId/skills
 * @desc    Obtener todos los skills de un perfil
 * @access  Private
 */
router.get('/', authenticate, validateParams(profileIdSchema), skillController.getByProfile);

/**
 * @route   POST /api/profiles/:profileId/skills
 * @desc    Crear nuevo skill
 * @access  Private
 */
router.post(
  '/',
  authenticate,
  validateParams(profileIdSchema),
  validate(createSkillSchema),
  skillController.create
);

/**
 * @route   GET /api/profiles/:profileId/skills/:id
 * @desc    Obtener un skill específico
 * @access  Private
 */
router.get('/:id', authenticate, validateParams(skillIdSchema), skillController.getById);

/**
 * @route   PUT /api/profiles/:profileId/skills/:id
 * @desc    Actualizar un skill
 * @access  Private
 */
router.put(
  '/:id',
  authenticate,
  validateParams(skillIdSchema),
  validate(updateSkillSchema),
  skillController.update
);

/**
 * @route   DELETE /api/profiles/:profileId/skills/:id
 * @desc    Eliminar un skill
 * @access  Private
 */
router.delete('/:id', authenticate, validateParams(skillIdSchema), skillController.delete);

/**
 * @route   PATCH /api/profiles/:profileId/skills/:id/toggle-visibility
 * @desc    Toggle visibility de skill
 * @access  Private
 */
router.patch(
  '/:id/toggle-visibility',
  authenticate,
  validateParams(skillIdSchema),
  skillController.toggleVisibility
);

module.exports = router;
