const express = require('express');
const router = express.Router();

// Health check interno
router.get('/health', (req, res) => {
  res.json({
    status: 'API OK',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Rutas principales
router.use('/auth', require('./auth.routes'));
router.use('/profiles', require('./profile.routes'));
router.use('/templates', require('./template.routes'));
router.use('/color-schemes', require('./colorScheme.routes'));

// Rutas futuras (se agregarán en fases posteriores)
// router.use('/users', require('./user.routes'));
// router.use('/education', require('./education.routes'));
// router.use('/experience', require('./experience.routes'));

module.exports = router;
