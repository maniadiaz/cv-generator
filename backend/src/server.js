require('dotenv').config();
const app = require('./config/app');
const db = require('./models');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

// Sincronizar base de datos
db.sequelize.authenticate()
  .then(() => {
    logger.info('✅ Database connected successfully');

    // Iniciar servidor
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
      logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((error) => {
    logger.error('❌ Unable to connect to database:', error);
    process.exit(1);
  });


