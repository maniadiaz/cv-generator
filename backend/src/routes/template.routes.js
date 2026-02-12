const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');

/**
 * @route   GET /api/templates
 * @desc    Listar todas las plantillas disponibles
 * @access  Public (sin autenticación)
 */
router.get('/', templateController.getTemplates);

module.exports = router;
