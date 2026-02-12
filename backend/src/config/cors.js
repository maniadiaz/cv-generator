// Lista de orígenes permitidos
const allowedOrigins = [
  process.env.FRONTEND_URL                              // Variable de entorno personalizada
].filter(Boolean); // Remover valores undefined

module.exports = {
  origin: function (origin, callback) {
    // Permitir solicitudes sin origin (como mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    // Verificar si el origin está en la lista de permitidos
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
