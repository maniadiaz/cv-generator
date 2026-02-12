const express = require('express');
const router = express.Router();
const colorSchemeController = require('../controllers/colorSchemeController');

/**
 * @route   GET /api/color-schemes
 * @desc    Obtener todos los esquemas de colores
 * @access  Public
 */
router.get('/', colorSchemeController.getAllSchemes);

/**
 * @route   GET /api/color-schemes/categories
 * @desc    Obtener esquemas agrupados por categoría
 * @access  Public
 */
router.get('/categories', colorSchemeController.getSchemesByCategory);

/**
 * @route   GET /api/color-schemes/category/:category
 * @desc    Obtener esquemas de una categoría específica
 * @access  Public
 */
router.get('/category/:category', colorSchemeController.getSchemesByCategoryName);

/**
 * @route   GET /api/color-schemes/:id
 * @desc    Obtener un esquema de color por ID
 * @access  Public
 */
router.get('/:id', colorSchemeController.getSchemeById);

module.exports = router;
