const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams para acceder a :profileId
const pdfController = require('../controllers/pdfController');
const { authenticate } = require('../middlewares/auth');
const { validateParams } = require('../middlewares/validation');
const { profileIdSchema } = require('../validators/pdfValidator');

/**
 * Todas las rutas requieren autenticación
 * Rutas base: /api/profiles/:profileId/pdf
 */

/**
 * @route   GET /api/profiles/:profileId/pdf/export-pdf
 * @desc    Exportar perfil a PDF y descargar
 * @access  Private
 */
router.get(
  '/export-pdf',
  authenticate,
  validateParams(profileIdSchema),
  pdfController.exportPdf
);

/**
 * @route   GET /api/profiles/:profileId/pdf/preview-pdf
 * @desc    Ver PDF en el navegador (inline)
 * @access  Private
 */
router.get(
  '/preview-pdf',
  authenticate,
  validateParams(profileIdSchema),
  pdfController.previewPdf
);

/**
 * @route   GET /api/profiles/:profileId/pdf/validate
 * @desc    Validar que el perfil está listo para exportar
 * @access  Private
 */
router.get(
  '/validate',
  authenticate,
  validateParams(profileIdSchema),
  pdfController.validateProfile
);

module.exports = router;
