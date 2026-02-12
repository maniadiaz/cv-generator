# 📄 CV Generator - Backend API

API REST para generación de CVs profesionales con múltiples templates y personalización de colores.

**Versión:** 1.0.0
**Stack:** Node.js + Express + Sequelize + MySQL
**Estado:** ✅ En Producción

> **⚠️ Nota sobre el código público:**
> Este repositorio muestra la **arquitectura y estructura** del proyecto para fines de portafolio.
> Las implementaciones de lógica de negocio, scripts de migración y tests están excluidas del repositorio público por razones de propiedad intelectual.

---

## 🚀 Características

- ✅ **Autenticación JWT** - Login, registro y refresh tokens
- ✅ **Múltiples Templates** - Harvard Classic, Harvard Modern, Oxford, ATS Optimized
- ✅ **Esquemas de Colores** - 10 esquemas profesionales predefinidos
- ✅ **Generación de PDF** - Export a PDF con Puppeteer
- ✅ **33 Categorías de Skills** - Desde programación hasta medicina
- ✅ **Gestión Completa de Perfiles** - Información personal, experiencia, educación, skills, idiomas, certificaciones
- ✅ **Validación Robusta** - Joi validation en todos los endpoints
- ✅ **CORS Configurado** - Soporte para múltiples orígenes
- ✅ **Rate Limiting** - Protección contra abuso
- ✅ **Logging** - Winston logger para desarrollo y producción

---

## 📋 Requisitos

- **Node.js**: v18+ (recomendado v22)
- **MySQL**: v8.0+
- **npm**: v9+

---

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Server
NODE_ENV=development
PORT=5001

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:5173

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=cv_generator

# JWT
JWT_SECRET=tu_jwt_secret_super_seguro
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
```

### 4. Crear la base de datos

```sql
CREATE DATABASE cv_generator CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. Ejecutar migraciones

```bash
npm run migrate
npm run migrate:skills      # Migrar categorías de skills
npm run migrate:oxford      # Migrar template Oxford
```

---

## 🎮 Comandos Disponibles

```bash
npm run dev              # Servidor con nodemon (auto-reload)
npm start                # Servidor de producción

npm run migrate          # Ejecutar migraciones
npm run migrate:skills   # Migrar categorías de skills
npm run migrate:oxford   # Migrar template Oxford

npm test                 # Ejecutar tests
npm run generate:html    # Generar previews HTML
npm run generate:previews # Generar previews PNG
```

---

## 🔌 API Endpoints

### Base URL
- **Development:** http://localhost:5001
- **Production:** Configurar según entorno

### Autenticación
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
GET    /api/auth/me
```

### Perfiles
```
GET    /api/profiles
POST   /api/profiles
GET    /api/profiles/:id
PATCH  /api/profiles/:id
DELETE /api/profiles/:id
PATCH  /api/profiles/:id/template
```

### Templates
```
GET    /api/templates
GET    /api/profiles/:id/pdf/preview-html
GET    /api/profiles/:id/pdf/preview-pdf
POST   /api/export/:id/pdf
```

### Esquemas de Colores
```
GET    /api/color-schemes
GET    /api/color-schemes/categories
GET    /api/color-schemes/:id
```

**Ver documentación completa:** Todos los endpoints están documentados en el código.

---

## 🎨 Templates Disponibles

1. **Harvard Classic** (`harvard_classic`) - Clásico, serif, profesional
2. **Harvard Modern** (`harvard_modern`) - Moderno, sans-serif, colorido
3. **Oxford** (`oxford`) - Elegante, académico, dos columnas
4. **ATS Optimized** (`ats`) - Optimizado para sistemas de seguimiento de candidatos

---

## 🎨 Esquemas de Colores

10 esquemas profesionales en 4 categorías:

- **Clásicos:** Harvard Crimson, Oxford Blue, Burgundy Wine
- **Corporativos:** Professional Navy
- **Modernos:** Forest Green, Slate Gray, Teal Ocean, Charcoal Black
- **Creativos:** Royal Purple, Sunset Orange

**Ver guía completa:** [COLOR_SCHEMES_GUIDE.md](./COLOR_SCHEMES_GUIDE.md)

---

## 🔐 Autenticación

Todos los endpoints requieren header JWT (excepto auth y color-schemes):

```http
Authorization: Bearer <your_jwt_token>
```

---

## 🚀 Deployment en Producción

```bash
# Instalar PM2
npm install -g pm2

# Iniciar
pm2 start src/server.js --name api-cv

# Ver logs
pm2 logs api-cv

# Reiniciar
pm2 restart api-cv
```

### Variables de entorno en producción:

```bash
NODE_ENV=production
FRONTEND_URL=https://tu-dominio-frontend.com
DB_HOST=tu_host
DB_USER=tu_usuario
DB_PASSWORD=tu_password
JWT_SECRET=tu_secret_seguro
```

---

## 🐛 Troubleshooting

### Error: "Too many keys specified"
**Solución:** Ya solucionado. El `sequelize.sync()` está desactivado.

### Error: CORS blocked
**Solución:** Configura `FRONTEND_URL` en `.env` o agrega tu dominio en `src/config/cors.js`

### Error: Port already in use
```bash
# Windows
taskkill //F //IM node.exe

# Linux/Mac
killall node
```

---

## 📚 Documentación Adicional

- [COLOR_SCHEMES_GUIDE.md](./COLOR_SCHEMES_GUIDE.md) - Guía completa de esquemas de colores
- [CORS_FIX_GUIDE.md](./CORS_FIX_GUIDE.md) - Solución de problemas de CORS
- [RESUMEN_COLOR_SCHEMES.md](./RESUMEN_COLOR_SCHEMES.md) - Resumen ejecutivo

---

## 🔒 Seguridad

- ✅ Helmet - Headers HTTP seguros
- ✅ CORS - Orígenes específicos
- ✅ Rate Limiting - Anti-brute force
- ✅ JWT - Tokens seguros
- ✅ Bcrypt - Contraseñas hasheadas
- ✅ Joi Validation - Validación de entrada

---

## 📊 Estructura de Base de Datos

```
users (1) ----< (N) profiles
                     |
                     +---< (1) personal_infos
                     +---< (N) experiences
                     +---< (N) educations
                     +---< (N) skills
                     +---< (N) languages
                     +---< (N) certifications
                     +---< (N) social_networks
```

---

## 📁 Qué incluye este repositorio público

### ✅ **Código fuente disponible:**

- **Arquitectura completa** - Estructura de carpetas y organización del proyecto
- **Modelos de datos** - Definición de esquemas (sin datos sensibles)
- **Rutas y controladores** - Estructura de la API REST
- **Servicios** - Lógica de negocio visible
- **Configuración** - Archivos de configuración (sin credenciales)
- **Validadores** - Esquemas de validación con Joi
- **Middleware** - Auth, CORS, rate limiting, etc.
- **Utilidades** - Helpers y funciones auxiliares
- **Documentación** - README, guías de API

### ❌ **Excluido del repositorio público:**

Por razones de **propiedad intelectual** y **seguridad**, lo siguiente NO está incluido:

- **Scripts de migración** - Implementaciones propietarias (`/scripts/`)
- **Tests** - Suite completa de testing (`/tests/`)
- **Backups** - Respaldos de base de datos (`/backups/`)
- **Variables de entorno** - Credenciales y secretos (`.env`)
- **Datos de usuarios** - Información personal (`/uploads/`, `/exports/`)
- **Logs de producción** - Registros del sistema (`/logs/`)

### 📝 **Propósito de este repositorio:**

Este repositorio está configurado como **portafolio público** para:
- ✅ Demostrar capacidades técnicas y arquitectura
- ✅ Mostrar conocimientos de Node.js, Express y Sequelize
- ✅ Evidenciar buenas prácticas de desarrollo
- ✅ Compartir con reclutadores y empleadores

**No está destinado para:**
- ❌ Instalación y ejecución directa (falta código propietario)
- ❌ Fork o clonación para uso productivo
- ❌ Distribución comercial

---

## 📞 Contacto

**Desarrollador:** Miguel Alexis Díaz Díaz

Para consultas sobre el proyecto completo o colaboraciones, por favor contacta directamente.

---

**Última actualización:** 2026-02-11
**Versión:** 1.0.0
**Estado:** ✅ Producción Ready
