module.exports = {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  expiresIn: process.env.JWT_EXPIRE || '24h',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '7d'
};
