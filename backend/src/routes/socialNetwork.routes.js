const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams para acceder a :profileId
const socialNetworkController = require('../controllers/socialNetworkController');
const { authenticate } = require('../middlewares/auth');
const { validate, validateParams } = require('../middlewares/validation');
const {
  createSocialNetworkSchema,
  updateSocialNetworkSchema,
  reorderSchema,
  socialNetworkIdSchema,
  profileIdSchema
} = require('../validators/socialNetworkValidator');

/**
 * Todas las rutas requieren autenticación
 * Rutas base: /api/profiles/:profileId/social-networks
 */

/**
 * @route   GET /api/profiles/:profileId/social-networks/stats
 * @desc    Obtener estadísticas de redes sociales
 * @access  Private
 */
router.get('/stats', authenticate, validateParams(profileIdSchema), socialNetworkController.getSocialNetworkStats);

/**
 * @route   POST /api/profiles/:profileId/social-networks/reorder
 * @desc    Reordenar redes sociales
 * @access  Private
 */
router.post(
  '/reorder',
  authenticate,
  validateParams(profileIdSchema),
  validate(reorderSchema),
  socialNetworkController.reorderSocialNetworks
);

/**
 * @route   GET /api/profiles/:profileId/social-networks
 * @desc    Obtener todas las redes sociales de un perfil
 * @access  Private
 */
router.get('/', authenticate, validateParams(profileIdSchema), socialNetworkController.getSocialNetworksByProfile);

/**
 * @route   POST /api/profiles/:profileId/social-networks
 * @desc    Crear nueva red social
 * @access  Private
 */
router.post(
  '/',
  authenticate,
  validateParams(profileIdSchema),
  validate(createSocialNetworkSchema),
  socialNetworkController.createSocialNetwork
);

/**
 * @route   GET /api/profiles/:profileId/social-networks/:id
 * @desc    Obtener una red social específica
 * @access  Private
 */
router.get('/:id', authenticate, validateParams(socialNetworkIdSchema), socialNetworkController.getSocialNetworkById);

/**
 * @route   PUT /api/profiles/:profileId/social-networks/:id
 * @desc    Actualizar una red social
 * @access  Private
 */
router.put(
  '/:id',
  authenticate,
  validateParams(socialNetworkIdSchema),
  validate(updateSocialNetworkSchema),
  socialNetworkController.updateSocialNetwork
);

/**
 * @route   DELETE /api/profiles/:profileId/social-networks/:id
 * @desc    Eliminar una red social
 * @access  Private
 */
router.delete('/:id', authenticate, validateParams(socialNetworkIdSchema), socialNetworkController.deleteSocialNetwork);

/**
 * @route   PATCH /api/profiles/:profileId/social-networks/:id/toggle-visibility
 * @desc    Toggle visibility de red social
 * @access  Private
 */
router.patch(
  '/:id/toggle-visibility',
  authenticate,
  validateParams(socialNetworkIdSchema),
  socialNetworkController.toggleVisibility
);

module.exports = router;
