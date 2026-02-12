const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const corsConfig = require('./cors');
const errorHandler = require('../middlewares/errorHandler');

const app = express();

// Middlewares de seguridad
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Permitir que las imágenes se carguen desde el frontend
}));
app.use(cors(corsConfig));

// Servir archivos estáticos (imágenes de previews de templates)
// Middleware personalizado para agregar headers CORS a las imágenes
app.use('/templates', (_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, '../../public/templates')));

// Middlewares de parseo
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('dev'));

// Compresión
app.use(compression());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rutas principales
app.use('/api', require('../routes'));

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error Handler (debe ser el último middleware)
app.use(errorHandler);

module.exports = app;
