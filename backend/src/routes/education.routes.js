const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams para acceder a :profileId
const educationController = require('../controllers/educationController');
const { authenticate } = require('../middlewares/auth');
const { validate, validateParams } = require('../middlewares/validation');
const {
  createEducationSchema,
  updateEducationSchema,
  reorderSchema,
  educationIdSchema,
  profileIdSchema
} = require('../validators/educationValidator');

/**
 * Todas las rutas requieren autenticación
 * Rutas base: /api/profiles/:profileId/education
 */

/**
 * @route   GET /api/profiles/:profileId/education/stats
 * @desc    Obtener estadísticas de educación
 * @access  Private
 */
router.get('/stats', authenticate, validateParams(profileIdSchema), educationController.getEducationStats);

/**
 * @route   POST /api/profiles/:profileId/education/reorder
 * @desc    Reordenar educaciones
 * @access  Private
 */
router.post(
  '/reorder',
  authenticate,
  validateParams(profileIdSchema),
  validate(reorderSchema),
  educationController.reorderEducations
);

/**
 * @route   GET /api/profiles/:profileId/education
 * @desc    Obtener todas las educaciones de un perfil
 * @access  Private
 */
router.get('/', authenticate, validateParams(profileIdSchema), educationController.getEducationsByProfile);

/**
 * @route   POST /api/profiles/:profileId/education
 * @desc    Crear nueva educación
 * @access  Private
 */
router.post(
  '/',
  authenticate,
  validateParams(profileIdSchema),
  validate(createEducationSchema),
  educationController.createEducation
);

/**
 * @route   GET /api/profiles/:profileId/education/:id
 * @desc    Obtener una educación específica
 * @access  Private
 */
router.get('/:id', authenticate, validateParams(educationIdSchema), educationController.getEducationById);

/**
 * @route   PUT /api/profiles/:profileId/education/:id
 * @desc    Actualizar una educación
 * @access  Private
 */
router.put(
  '/:id',
  authenticate,
  validateParams(educationIdSchema),
  validate(updateEducationSchema),
  educationController.updateEducation
);

/**
 * @route   DELETE /api/profiles/:profileId/education/:id
 * @desc    Eliminar una educación
 * @access  Private
 */
router.delete('/:id', authenticate, validateParams(educationIdSchema), educationController.deleteEducation);

/**
 * @route   PATCH /api/profiles/:profileId/education/:id/toggle-visibility
 * @desc    Toggle visibility de educación
 * @access  Private
 */
router.patch(
  '/:id/toggle-visibility',
  authenticate,
  validateParams(educationIdSchema),
  educationController.toggleVisibility
);

module.exports = router;
