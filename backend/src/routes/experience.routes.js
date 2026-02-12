const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams para acceder a :profileId
const experienceController = require('../controllers/experienceController');
const { authenticate } = require('../middlewares/auth');
const { validate, validateParams } = require('../middlewares/validation');
const {
  createExperienceSchema,
  updateExperienceSchema,
  reorderSchema,
  experienceIdSchema,
  profileIdSchema
} = require('../validators/experienceValidator');

/**
 * Todas las rutas requieren autenticación
 * Rutas base: /api/profiles/:profileId/experience
 */

/**
 * @route   GET /api/profiles/:profileId/experience/stats
 * @desc    Obtener estadísticas de experiencia
 * @access  Private
 */
router.get('/stats', authenticate, validateParams(profileIdSchema), experienceController.getExperienceStats);

/**
 * @route   POST /api/profiles/:profileId/experience/reorder
 * @desc    Reordenar experiencias
 * @access  Private
 */
router.post(
  '/reorder',
  authenticate,
  validateParams(profileIdSchema),
  validate(reorderSchema),
  experienceController.reorderExperiences
);

/**
 * @route   GET /api/profiles/:profileId/experience
 * @desc    Obtener todas las experiencias de un perfil
 * @access  Private
 */
router.get('/', authenticate, validateParams(profileIdSchema), experienceController.getExperiencesByProfile);

/**
 * @route   POST /api/profiles/:profileId/experience
 * @desc    Crear nueva experiencia
 * @access  Private
 */
router.post(
  '/',
  authenticate,
  validateParams(profileIdSchema),
  validate(createExperienceSchema),
  experienceController.createExperience
);

/**
 * @route   GET /api/profiles/:profileId/experience/:id
 * @desc    Obtener una experiencia específica
 * @access  Private
 */
router.get('/:id', authenticate, validateParams(experienceIdSchema), experienceController.getExperienceById);

/**
 * @route   PUT /api/profiles/:profileId/experience/:id
 * @desc    Actualizar una experiencia
 * @access  Private
 */
router.put(
  '/:id',
  authenticate,
  validateParams(experienceIdSchema),
  validate(updateExperienceSchema),
  experienceController.updateExperience
);

/**
 * @route   DELETE /api/profiles/:profileId/experience/:id
 * @desc    Eliminar una experiencia
 * @access  Private
 */
router.delete('/:id', authenticate, validateParams(experienceIdSchema), experienceController.deleteExperience);

/**
 * @route   PATCH /api/profiles/:profileId/experience/:id/toggle-visibility
 * @desc    Toggle visibility de experiencia
 * @access  Private
 */
router.patch(
  '/:id/toggle-visibility',
  authenticate,
  validateParams(experienceIdSchema),
  experienceController.toggleVisibility
);

module.exports = router;
