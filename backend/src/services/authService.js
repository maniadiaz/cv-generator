const { User } = require('../models');
const tokenService = require('./tokenService');
const emailService = require('./emailService');
const logger = require('../utils/logger');

class AuthService {
  /**
   * Registrar nuevo usuario
   */
  async register(userData) {
    const { email, password, first_name, last_name } = userData;

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Generar token de verificación
    const verificationToken = tokenService.generateRandomToken();

    // Crear usuario
    const user = await User.create({
      email,
      password_hash: password, // Se hasheará automáticamente en el hook
      first_name,
      last_name,
      verification_token: verificationToken,
      is_verified: false
    });

    // Enviar email de verificación (no bloqueante)
    emailService.sendWelcomeEmail(user, verificationToken)
      .catch(error => {
        logger.error('Failed to send welcome email:', error);
      });

    logger.info(`User registered: ${user.email}`);

    return {
      user,
      message: 'User registered successfully. Please check your email to verify your account.'
    };
  }

  /**
   * Login de usuario
   */
  async login(email, password, deviceInfo = {}) {
    // Buscar usuario
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verificar si la cuenta está activa
    if (!user.is_active) {
      throw new Error('Account is deactivated. Please contact support.');
    }

    // Verificar si el email está verificado
    if (!user.is_verified) {
      throw new Error('Email not verified');
    }

    // Verificar si la cuenta está bloqueada
    if (user.isLocked()) {
      const minutesLeft = Math.ceil((user.locked_until - new Date()) / 1000 / 60);
      throw new Error(`Account locked due to multiple failed login attempts. Try again in ${minutesLeft} minutes.`);
    }

    // Verificar contraseña
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      await user.incrementLoginAttempts();
      throw new Error('Invalid credentials');
    }

    // Reset intentos de login
    await user.resetLoginAttempts();

    // Generar tokens
    const tokens = tokenService.generateTokenPair(user.id);

    // Crear sesión
    await tokenService.createSession(user.id, tokens, deviceInfo);

    logger.info(`User logged in: ${user.email}`);

    return {
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      message: 'Login successful'
    };
  }

  /**
   * Logout de usuario
   */
  async logout(accessToken) {
    const revoked = await tokenService.revokeSession(accessToken);

    if (revoked) {
      logger.info('User logged out successfully');
      return { message: 'Logout successful' };
    }

    throw new Error('Session not found or already expired');
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken) {
    try {
      // Verificar refresh token
      const decoded = tokenService.verifyRefreshToken(refreshToken);

      // Buscar sesión activa con este refresh token
      const session = await require('../models').Session.findOne({
        where: {
          refresh_token: refreshToken,
          is_active: true
        },
        include: [{
          model: User,
          as: 'user'
        }]
      });

      if (!session) {
        throw new Error('Invalid refresh token or session expired');
      }

      // Verificar que el usuario aún existe y está activo
      if (!session.user || !session.user.is_active) {
        throw new Error('User not found or account deactivated');
      }

      // Generar nuevos tokens
      const tokens = tokenService.generateTokenPair(session.user.id);

      // Actualizar sesión
      session.token = tokens.accessToken;
      session.refresh_token = tokens.refreshToken;
      session.expires_at = tokenService.calculateExpiration(require('../config/jwt').expiresIn);
      session.refresh_expires_at = tokenService.calculateExpiration(require('../config/jwt').refreshExpiresIn);
      await session.save();

      logger.info(`Token refreshed for user: ${session.user.email}`);

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: session.user,
        message: 'Token refreshed successfully'
      };

    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  /**
   * Verificar email con token
   */
  async verifyEmail(token) {
    const user = await User.findOne({ where: { verification_token: token } });

    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    if (user.is_verified) {
      throw new Error('Email already verified');
    }

    // Marcar como verificado
    user.is_verified = true;
    user.verification_token = null;
    await user.save();

    logger.info(`Email verified for user: ${user.email}`);

    return {
      message: 'Email verified successfully. You can now login.'
    };
  }

  /**
   * Solicitar reset de contraseña
   */
  async forgotPassword(email) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // Por seguridad, no revelar si el email existe
      return {
        message: 'If the email exists, a password reset link has been sent.'
      };
    }

    // Generar token de reset
    const resetToken = tokenService.generateRandomToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    user.reset_password_token = resetToken;
    user.reset_password_expires = resetExpires;
    await user.save();

    // Enviar email (no bloqueante)
    emailService.sendPasswordResetEmail(user, resetToken)
      .catch(error => {
        logger.error('Failed to send password reset email:', error);
      });

    logger.info(`Password reset requested for: ${user.email}`);

    return {
      message: 'If the email exists, a password reset link has been sent.'
    };
  }

  /**
   * Resetear contraseña con token
   */
  async resetPassword(token, newPassword) {
    const user = await User.findOne({
      where: {
        reset_password_token: token
      }
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    // Verificar que el token no haya expirado
    if (user.reset_password_expires < new Date()) {
      throw new Error('Reset token has expired');
    }

    // Actualizar contraseña
    user.password_hash = newPassword; // Se hasheará automáticamente
    user.reset_password_token = null;
    user.reset_password_expires = null;
    await user.save();

    // Revocar todas las sesiones activas por seguridad
    await tokenService.revokeAllUserSessions(user.id);

    // Enviar confirmación por email (no bloqueante)
    emailService.sendPasswordChangedEmail(user)
      .catch(error => {
        logger.error('Failed to send password changed email:', error);
      });

    logger.info(`Password reset for user: ${user.email}`);

    return {
      message: 'Password reset successfully. Please login with your new password.'
    };
  }

  /**
   * Obtener usuario por ID
   */
  async getUserById(userId) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Actualizar perfil de usuario
   */
  async updateProfile(userId, updates) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Solo permitir actualizar ciertos campos
    const allowedFields = ['first_name', 'last_name', 'avatar_url'];
    const filteredUpdates = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    }

    await user.update(filteredUpdates);

    logger.info(`Profile updated for user: ${user.email}`);

    return user;
  }
}

module.exports = new AuthService();
