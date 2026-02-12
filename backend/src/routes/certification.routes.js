const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams para acceder a :profileId
const certificationController = require('../controllers/certificationController');
const { authenticate } = require('../middlewares/auth');
const { validate, validateParams } = require('../middlewares/validation');
const {
  createCertificationSchema,
  updateCertificationSchema,
  reorderSchema,
  certificationIdSchema,
  profileIdSchema
} = require('../validators/certificationValidator');

/**
 * Todas las rutas requieren autenticación
 * Rutas base: /api/profiles/:profileId/certifications
 */

/**
 * @route   GET /api/profiles/:profileId/certifications/stats
 * @desc    Obtener estadísticas de certifications
 * @access  Private
 */
router.get('/stats', authenticate, validateParams(profileIdSchema), certificationController.getStats);

/**
 * @route   POST /api/profiles/:profileId/certifications/reorder
 * @desc    Reordenar certifications
 * @access  Private
 */
router.post(
  '/reorder',
  authenticate,
  validateParams(profileIdSchema),
  validate(reorderSchema),
  certificationController.reorder
);

/**
 * @route   GET /api/profiles/:profileId/certifications
 * @desc    Obtener todas las certifications de un perfil
 * @access  Private
 */
router.get('/', authenticate, validateParams(profileIdSchema), certificationController.getByProfile);

/**
 * @route   POST /api/profiles/:profileId/certifications
 * @desc    Crear nueva certification
 * @access  Private
 */
router.post(
  '/',
  authenticate,
  validateParams(profileIdSchema),
  validate(createCertificationSchema),
  certificationController.create
);

/**
 * @route   GET /api/profiles/:profileId/certifications/:id
 * @desc    Obtener una certification específica
 * @access  Private
 */
router.get('/:id', authenticate, validateParams(certificationIdSchema), certificationController.getById);

/**
 * @route   PUT /api/profiles/:profileId/certifications/:id
 * @desc    Actualizar una certification
 * @access  Private
 */
router.put(
  '/:id',
  authenticate,
  validateParams(certificationIdSchema),
  validate(updateCertificationSchema),
  certificationController.update
);

/**
 * @route   DELETE /api/profiles/:profileId/certifications/:id
 * @desc    Eliminar una certification
 * @access  Private
 */
router.delete('/:id', authenticate, validateParams(certificationIdSchema), certificationController.delete);

/**
 * @route   PATCH /api/profiles/:profileId/certifications/:id/toggle-visibility
 * @desc    Toggle visibility de certification
 * @access  Private
 */
router.patch(
  '/:id/toggle-visibility',
  authenticate,
  validateParams(certificationIdSchema),
  certificationController.toggleVisibility
);

module.exports = router;
