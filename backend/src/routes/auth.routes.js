const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');
const { validate, validateParams } = require('../middlewares/validation');
const {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  updateProfileSchema
} = require('../validators/authValidator');

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario
 * @access  Public
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login de usuario
 * @access  Public
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * @route   POST /api/auth/logout
 * @desc    Cerrar sesión
 * @access  Private (requiere autenticación)
 */
router.post('/logout', authenticate, authController.logout);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refrescar access token
 * @access  Public
 */
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);

/**
 * @route   GET /api/auth/verify-email/:token
 * @desc    Verificar email con token
 * @access  Public
 */
router.get('/verify-email/:token', validateParams(verifyEmailSchema), authController.verifyEmail);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Solicitar reset de contraseña
 * @access  Public
 */
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Resetear contraseña con token
 * @access  Public
 */
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

/**
 * @route   GET /api/auth/me
 * @desc    Obtener usuario autenticado
 * @access  Private (requiere autenticación)
 */
router.get('/me', authenticate, authController.getMe);

/**
 * @route   PUT /api/auth/profile
 * @desc    Actualizar perfil de usuario autenticado
 * @access  Private (requiere autenticación)
 */
router.put('/profile', authenticate, validate(updateProfileSchema), authController.updateProfile);

module.exports = router;
