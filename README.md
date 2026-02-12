# 📄 CV Generator - Full Stack Application

> Generador profesional de CVs con múltiples plantillas, esquemas de color personalizables y exportación a PDF.
**🌐 Demo en vivo:** [https://cv-generator.servercontrol-mzt.com/](https://cv-generator.servercontrol-mzt.com/)

---

## 🎯 Descripción del Proyecto

**CV Generator** es una aplicación web full stack que permite a los usuarios crear, personalizar y exportar currículums profesionales de manera sencilla e intuitiva. El sistema ofrece múltiples plantillas de diseño inspiradas en formatos académicos prestigiosos, esquemas de color profesionales, y exportación a PDF de alta calidad.

### ✨ Características Principales

- 🎨 **4 Plantillas Profesionales**: Harvard Classic, Harvard Modern, Oxford, y ATS Optimized
- 🌈 **10+ Esquemas de Color**: Personalización completa con paletas predefinidas
- 📄 **Exportación a PDF**: Generación de CVs en formato PDF con Puppeteer
- 🔐 **Sistema de Autenticación**: JWT con refresh tokens para seguridad robusta
- 📊 **Gestión Completa de Perfil**:
  - Información personal
  - Experiencia laboral
  - Educación académica
  - Habilidades técnicas (33 categorías)
  - Idiomas con niveles certificados
  - Certificaciones profesionales
  - Redes sociales
- 📱 **Responsive Design**: Interfaz adaptable a todos los dispositivos
- ⚡ **Preview en Tiempo Real**: Vista previa instantánea de cambios
- 🎯 **Optimización ATS**: Template especial para sistemas de seguimiento de candidatos

---

## 🏗️ Arquitectura del Proyecto

### Stack Tecnológico

#### **Backend**
- **Runtime**: Node.js v22+
- **Framework**: Express.js
- **Base de Datos**: MySQL 8.0+
- **ORM**: Sequelize
- **Autenticación**: JWT (JSON Web Tokens)
- **Generación PDF**: Puppeteer
- **Validación**: Joi
- **Seguridad**: Helmet, CORS, Rate Limiting
- **Logging**: Winston

#### **Frontend**
- React + Vite
- TypeScript
- TailwindCSS
- React Router
- Axios
- Context API

---

## 📂 Estructura del Repositorio

```
cv-generator/
├── backend/          # API REST con Node.js + Express
│   ├── src/
│   │   ├── config/       # Configuraciones
│   │   ├── controllers/  # Controladores de rutas
│   │   ├── models/       # Modelos de Sequelize
│   │   ├── routes/       # Definición de endpoints
│   │   ├── services/     # Lógica de negocio
│   │   ├── middlewares/  # Auth, validación, etc.
│   │   ├── validators/   # Esquemas Joi
│   │   └── utils/        # Utilidades
│   ├── package.json
│   └── README.md         # Documentación detallada del backend
│
└── README.md         # Este archivo
```

---

## 🚀 Características Técnicas

### Backend API

- **50+ Endpoints REST** organizados por recursos
- **Validación robusta** con Joi en todos los endpoints
- **Middleware de autenticación** con JWT y refresh tokens
- **CORS configurado** para múltiples orígenes
- **Rate limiting** para prevenir abuso
- **Logging estructurado** con Winston
- **Gestión de errores** centralizada
- **Sequelize ORM** con migraciones
- **Generación de PDF** con Puppeteer (headless Chrome)

### Plantillas de CV

1. **Harvard Classic** - Diseño tradicional con tipografía serif
2. **Harvard Modern** - Estilo moderno con elementos visuales contemporáneos
3. **Oxford** - Formato académico elegante de dos columnas
4. **ATS Optimized** - Optimizado para sistemas de seguimiento de candidatos

### Esquemas de Color

10 esquemas profesionales en 4 categorías:
- Clásicos (Harvard Crimson, Oxford Blue, Burgundy Wine)
- Corporativos (Professional Navy)
- Modernos (Forest Green, Slate Gray, Teal Ocean, Charcoal Black)
- Cálidos (Sunset Orange, Royal Purple)

### Categorías de Skills

33 categorías que abarcan:
- Lenguajes de programación
- Frameworks y librerías
- Bases de datos
- Cloud y DevOps
- Herramientas de oficina
- Soft skills
- Y más...

---

## 🔒 Seguridad y Privacidad

Este repositorio está configurado para **portafolio público**, mostrando la arquitectura y capacidades técnicas del proyecto sin exponer:

- ❌ Credenciales de base de datos
- ❌ Claves API y secretos
- ❌ Lógica de negocio propietaria (scripts internos)
- ❌ Suite de tests completa
- ❌ Datos de usuarios reales
- ❌ Configuraciones de producción

Para más detalles sobre la implementación completa, por favor contacta al desarrollador.

---

## 📚 Documentación

- **Backend API**: Ver [backend/README.md](backend/README.md) para documentación completa del API
- **Endpoints**: Más de 50 endpoints documentados con ejemplos
- **Modelos de Datos**: Esquemas completos de base de datos
- **Guía de Seguridad**: Mejores prácticas implementadas

---

## 🎓 Casos de Uso

### Para Usuarios
1. **Crear múltiples perfiles** de CV para diferentes posiciones
2. **Personalizar diseño** eligiendo entre plantillas y colores
3. **Exportar a PDF** con un click
4. **Vista previa en tiempo real** antes de descargar
5. **Gestionar información** de forma organizada

### Para Desarrolladores (Portafolio)
Este proyecto demuestra:
- ✅ Arquitectura MVC bien estructurada
- ✅ API REST con buenas prácticas
- ✅ Autenticación y autorización robusta
- ✅ Manejo de relaciones complejas en base de datos
- ✅ Integración con servicios externos (PDF generation)
- ✅ Código limpio y mantenible
- ✅ Documentación completa

---

## 🌟 Demo

**Visita la aplicación en vivo:** [https://cv-generator.servercontrol-mzt.com/](https://cv-generator.servercontrol-mzt.com/)

Funcionalidades disponibles en la demo:
- Registro y autenticación de usuarios
- Creación de perfiles de CV
- Selección de plantillas y colores
- Vista previa en tiempo real
- Exportación a PDF
- Gestión completa de información profesional

---

## 👨‍💻 Desarrollador

**Miguel Alexis Díaz Díaz**

Este proyecto fue desarrollado como demostración de capacidades full stack, incluyendo:
- Diseño y arquitectura de sistemas
- Desarrollo backend con Node.js
- Desarrollo frontend con React
- Gestión de bases de datos
- Implementación de seguridad
- Despliegue en producción

---

## 📄 Licencia

Este proyecto es de código cerrado. El repositorio público muestra la estructura y arquitectura con fines de portafolio.

Para consultas sobre el proyecto completo o colaboraciones, por favor contacta directamente.

---

## 📞 Contacto

Para más información sobre el proyecto, colaboraciones o consultas técnicas, por favor contacta al desarrollador.

---

**⭐ Si te gusta este proyecto, no olvides darle una estrella!**

---

*Última actualización: Febrero 2026*