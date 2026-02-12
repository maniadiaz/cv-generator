const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const jwtConfig = require('../config/jwt');
const { Session } = require('../models');

class TokenService {
  /**
   * Generar access token
   */
  generateAccessToken(payload) {
    return jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn
    });
  }

  /**
   * Generar refresh token
   */
  generateRefreshToken(payload) {
    return jwt.sign(payload, jwtConfig.refreshSecret, {
      expiresIn: jwtConfig.refreshExpiresIn
    });
  }

  /**
   * Generar par de tokens (access + refresh)
   */
  generateTokenPair(userId) {
    const payload = { userId };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  /**
   * Verificar access token
   */
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, jwtConfig.secret);
    } catch (error) {
      throw new Error(`Invalid access token: ${error.message}`);
    }
  }

  /**
   * Verificar refresh token
   */
  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, jwtConfig.refreshSecret);
    } catch (error) {
      throw new Error(`Invalid refresh token: ${error.message}`);
    }
  }

  /**
   * Decodificar token sin verificar
   */
  decodeToken(token) {
    return jwt.decode(token);
  }

  /**
   * Generar token aleatorio para verificación/reset
   */
  generateRandomToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Calcular fecha de expiración
   */
  calculateExpiration(timeString) {
    // timeString puede ser "24h", "7d", etc.
    const unit = timeString.slice(-1);
    const value = parseInt(timeString.slice(0, -1));

    const now = new Date();

    switch (unit) {
    case 'h':
      return new Date(now.getTime() + value * 60 * 60 * 1000);
    case 'd':
      return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
    case 'm':
      return new Date(now.getTime() + value * 60 * 1000);
    default:
      throw new Error('Invalid time unit. Use h (hours), d (days), or m (minutes)');
    }
  }

  /**
   * Crear sesión en base de datos
   */
  async createSession(userId, tokens, deviceInfo = {}) {
    const { accessToken, refreshToken } = tokens;

    const session = await Session.create({
      user_id: userId,
      token: accessToken,
      refresh_token: refreshToken,
      ip_address: deviceInfo.ip_address,
      user_agent: deviceInfo.user_agent,
      device_type: deviceInfo.device_type || 'desktop',
      device_name: deviceInfo.device_name,
      expires_at: this.calculateExpiration(jwtConfig.expiresIn),
      refresh_expires_at: this.calculateExpiration(jwtConfig.refreshExpiresIn),
      is_active: true
    });

    return session;
  }

  /**
   * Revocar sesión (logout)
   */
  async revokeSession(token) {
    const session = await Session.findOne({ where: { token, is_active: true } });

    if (session) {
      await session.revoke();
      return true;
    }

    return false;
  }

  /**
   * Revocar todas las sesiones de un usuario
   */
  async revokeAllUserSessions(userId) {
    await Session.update(
      { is_active: false },
      { where: { user_id: userId, is_active: true } }
    );
  }

  /**
   * Limpiar sesiones expiradas
   */
  async cleanupExpiredSessions() {
    const now = new Date();

    const deletedCount = await Session.destroy({
      where: {
        expires_at: { [require('sequelize').Op.lt]: now }
      }
    });

    return deletedCount;
  }

  /**
   * Obtener sesión activa por token
   */
  async getActiveSession(token) {
    return await Session.findOne({
      where: {
        token,
        is_active: true
      },
      include: [{
        model: require('../models').User,
        as: 'user'
      }]
    });
  }
}

module.exports = new TokenService();
