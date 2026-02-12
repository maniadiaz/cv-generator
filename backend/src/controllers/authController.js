const authService = require('../services/authService');
const ApiResponse = require('../utils/response');
const logger = require('../utils/logger');

class AuthController {
  /**
   * POST /api/auth/register
   * Registrar nuevo usuario
   */
  async register(req, res) {
    try {
      const { email, password, first_name, last_name } = req.body;

      const result = await authService.register({
        email,
        password,
        first_name,
        last_name
      });

      return ApiResponse.created(res, {
        user: result.user
      }, result.message);

    } catch (error) {
      logger.error('Register error:', error);

      if (error.message === 'Email already registered') {
        return ApiResponse.conflict(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * POST /api/auth/login
   * Login de usuario
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Obtener información del dispositivo
      const deviceInfo = {
        ip_address: req.ip || req.connection.remoteAddress,
        user_agent: req.headers['user-agent'],
        device_type: AuthController.getDeviceType(req.headers['user-agent'])
      };

      const result = await authService.login(email, password, deviceInfo);

      return ApiResponse.success(res, {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken
      }, result.message);

    } catch (error) {
      logger.error('Login error:', error);

      if (error.message === 'Invalid credentials') {
        return ApiResponse.unauthorized(res, 'Invalid email or password');
      }

      if (error.message === 'Email not verified') {
        return ApiResponse.forbidden(res, 'Please verify your email before logging in. Check your inbox for the verification link.');
      }

      if (error.message.includes('Account locked')) {
        return ApiResponse.forbidden(res, error.message);
      }

      if (error.message.includes('deactivated')) {
        return ApiResponse.forbidden(res, error.message);
      }

      return ApiResponse.error(res, 'Login failed', 500);
    }
  }

  /**
   * POST /api/auth/logout
   * Cerrar sesión
   */
  async logout(req, res) {
    try {
      const token = req.token; // Viene del middleware authenticate

      const result = await authService.logout(token);

      return ApiResponse.success(res, null, result.message);

    } catch (error) {
      logger.error('Logout error:', error);
      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * POST /api/auth/refresh-token
   * Refrescar access token
   */
  async refreshToken(req, res) {
    try {
      const { refresh_token } = req.body;

      const result = await authService.refreshToken(refresh_token);

      return ApiResponse.success(res, {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken
      }, result.message);

    } catch (error) {
      logger.error('Refresh token error:', error);

      if (error.message.includes('Invalid') || error.message.includes('expired')) {
        return ApiResponse.unauthorized(res, 'Invalid or expired refresh token');
      }

      return ApiResponse.error(res, 'Token refresh failed', 500);
    }
  }

  /**
   * GET /api/auth/verify-email/:token
   * Verificar email con token
   */
  async verifyEmail(req, res) {
    try {
      const { token } = req.params;

      const result = await authService.verifyEmail(token);

      return ApiResponse.success(res, null, result.message);

    } catch (error) {
      logger.error('Email verification error:', error);

      if (error.message.includes('Invalid') || error.message.includes('expired')) {
        return ApiResponse.badRequest(res, error.message);
      }

      if (error.message.includes('already verified')) {
        return ApiResponse.success(res, null, error.message);
      }

      return ApiResponse.error(res, 'Email verification failed', 500);
    }
  }

  /**
   * POST /api/auth/forgot-password
   * Solicitar reset de contraseña
   */
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const result = await authService.forgotPassword(email);

      return ApiResponse.success(res, null, result.message);

    } catch (error) {
      logger.error('Forgot password error:', error);
      return ApiResponse.error(res, 'Failed to process request', 500);
    }
  }

  /**
   * POST /api/auth/reset-password
   * Resetear contraseña con token
   */
  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;

      const result = await authService.resetPassword(token, password);

      return ApiResponse.success(res, null, result.message);

    } catch (error) {
      logger.error('Reset password error:', error);

      if (error.message.includes('Invalid') || error.message.includes('expired')) {
        return ApiResponse.badRequest(res, error.message);
      }

      return ApiResponse.error(res, 'Password reset failed', 500);
    }
  }

  /**
   * GET /api/auth/me
   * Obtener usuario autenticado
   */
  async getMe(req, res) {
    try {
      // req.user viene del middleware authenticate
      return ApiResponse.success(res, {
        user: req.user
      }, 'User retrieved successfully');

    } catch (error) {
      logger.error('Get me error:', error);
      return ApiResponse.error(res, 'Failed to get user', 500);
    }
  }

  /**
   * PUT /api/auth/profile
   * Actualizar perfil de usuario autenticado
   */
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const updates = req.body;

      const user = await authService.updateProfile(userId, updates);

      return ApiResponse.success(res, {
        user
      }, 'Profile updated successfully');

    } catch (error) {
      logger.error('Update profile error:', error);
      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * Helper: Detectar tipo de dispositivo desde user agent
   */
  static getDeviceType(userAgent) {
    if (!userAgent) return 'desktop';

    const ua = userAgent.toLowerCase();

    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }

    if (/mobile|iphone|ipod|android|blackberry|opera mini|windows phone/i.test(ua)) {
      return 'mobile';
    }

    return 'desktop';
  }
}

module.exports = new AuthController();
