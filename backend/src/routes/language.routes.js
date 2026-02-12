const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams para acceder a :profileId
const languageController = require('../controllers/languageController');
const { authenticate } = require('../middlewares/auth');
const { validate, validateParams } = require('../middlewares/validation');
const {
  createLanguageSchema,
  updateLanguageSchema,
  reorderSchema,
  languageIdSchema,
  profileIdSchema
} = require('../validators/languageValidator');

/**
 * Todas las rutas requieren autenticación
 * Rutas base: /api/profiles/:profileId/languages
 */

/**
 * @route   GET /api/profiles/:profileId/languages/stats
 * @desc    Obtener estadísticas de languages
 * @access  Private
 */
router.get('/stats', authenticate, validateParams(profileIdSchema), languageController.getStats);

/**
 * @route   POST /api/profiles/:profileId/languages/reorder
 * @desc    Reordenar languages
 * @access  Private
 */
router.post(
  '/reorder',
  authenticate,
  validateParams(profileIdSchema),
  validate(reorderSchema),
  languageController.reorder
);

/**
 * @route   GET /api/profiles/:profileId/languages
 * @desc    Obtener todos los languages de un perfil
 * @access  Private
 */
router.get('/', authenticate, validateParams(profileIdSchema), languageController.getByProfile);

/**
 * @route   POST /api/profiles/:profileId/languages
 * @desc    Crear nuevo language
 * @access  Private
 */
router.post(
  '/',
  authenticate,
  validateParams(profileIdSchema),
  validate(createLanguageSchema),
  languageController.create
);

/**
 * @route   GET /api/profiles/:profileId/languages/:id
 * @desc    Obtener un language específico
 * @access  Private
 */
router.get('/:id', authenticate, validateParams(languageIdSchema), languageController.getById);

/**
 * @route   PUT /api/profiles/:profileId/languages/:id
 * @desc    Actualizar un language
 * @access  Private
 */
router.put(
  '/:id',
  authenticate,
  validateParams(languageIdSchema),
  validate(updateLanguageSchema),
  languageController.update
);

/**
 * @route   DELETE /api/profiles/:profileId/languages/:id
 * @desc    Eliminar un language
 * @access  Private
 */
router.delete('/:id', authenticate, validateParams(languageIdSchema), languageController.delete);

/**
 * @route   PATCH /api/profiles/:profileId/languages/:id/toggle-visibility
 * @desc    Toggle visibility de language
 * @access  Private
 */
router.patch(
  '/:id/toggle-visibility',
  authenticate,
  validateParams(languageIdSchema),
  languageController.toggleVisibility
);

module.exports = router;
