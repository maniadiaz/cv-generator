# CV Generator - Frontend

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite)
![Material-UI](https://img.shields.io/badge/MUI-6.2-007FFF?logo=mui)
![Redux](https://img.shields.io/badge/Redux-5.0-764ABC?logo=redux)

Aplicación web moderna para la creación, personalización y exportación de CVs profesionales con múltiples plantillas y esquemas de colores.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Scripts Disponibles](#-scripts-disponibles)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Tecnologías Principales](#-tecnologías-principales)
- [Arquitectura](#-arquitectura)
- [Características Principales](#-características-principales)
- [Internacionalización](#-internacionalización)
- [Temas y Personalización](#-temas-y-personalización)
- [PWA](#-pwa)
- [Deployment](#-deployment)
- [Contribuir](#-contribuir)

---

## ✨ Características

- 📄 **Gestión de Perfiles**: Crea y administra múltiples perfiles de CV
- 🎨 **Plantillas Profesionales**: Selecciona entre múltiples diseños (Harvard Classic, Harvard Modern, etc.)
- 🌈 **Esquemas de Colores**: 10+ esquemas predefinidos organizados por categoría
- 📱 **Diseño Responsive**: Optimizado para desktop, tablet y móvil
- 🌍 **Multilingüe**: Soporte para Español e Inglés
- 🌓 **Tema Claro/Oscuro**: Cambia entre modos con un clic
- 💾 **Persistencia Local**: Los datos persisten al recargar la página
- 📊 **Dashboard Interactivo**: Estadísticas y gestión visual de perfiles
- 📥 **Exportación PDF**: Descarga tu CV en formato PDF
- 🔐 **Autenticación Segura**: Sistema de login con tokens JWT
- ✅ **TypeScript**: Código totalmente tipado para mayor seguridad

---

## 📦 Requisitos Previos

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **Backend API**: El servidor backend debe estar corriendo

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd view-cv/frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del directorio frontend:

```env
# API URL
VITE_API_URL=API_URL_PRODUCCIÖN

# O para desarrollo local
# VITE_API_URL=http://localhost:3000
```

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## ⚙️ Configuración

### Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `VITE_API_URL` | URL del backend API | `http://localhost:3000` |

---

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo
npm run dev:host         # Desarrollo con acceso desde red local

# Build
npm run build            # Compilar para producción
npm run preview          # Previsualizar build de producción

# Calidad de Código
npm run lint             # Ejecutar ESLint
npm run type-check       # Verificar tipos TypeScript

# Testing (si está configurado)
npm run test             # Ejecutar tests
```

---

## 📁 Estructura del Proyecto

```
frontend/
├── public/              # Archivos estáticos
│   └── templates/       # Imágenes de plantillas
├── src/
│   ├── api/            # Servicios de API
│   │   ├── authService.ts
│   │   ├── profileService.ts
│   │   ├── colorSchemeService.ts
│   │   └── templatesService.ts
│   ├── assets/         # Recursos estáticos
│   │   └── icon.svg
│   ├── components/     # Componentes React
│   │   ├── auth/
│   │   ├── layout/
│   │   │   └── MainLayout.tsx
│   │   └── profile/
│   │       ├── TemplateSelector.tsx
│   │       ├── ColorSchemeSelector.tsx
│   │       └── PDFPreview.tsx
│   ├── hooks/          # Custom Hooks
│   │   ├── useAppSelector.ts
│   │   └── useAppDispatch.ts
│   ├── i18n/           # Internacionalización
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── es/
│   │       └── en/
│   ├── pages/          # Páginas principales
│   │   ├── Auth/
│   │   ├── Dashboard/
│   │   └── CVEditor/
│   ├── redux/          # Estado global
│   │   ├── store.ts
│   │   └── slices/
│   │       ├── authSlice.ts
│   │       ├── profileSlice.ts
│   │       └── themeSlice.ts
│   ├── routes/         # Configuración de rutas
│   │   └── AppRoutes.tsx
│   ├── theme/          # Configuración de temas
│   │   └── theme.ts
│   ├── types/          # Definiciones TypeScript
│   │   └── index.ts
│   ├── utils/          # Utilidades
│   │   └── userStorage.ts
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🛠️ Tecnologías Principales

### Core

- **[React 18.3](https://react.dev/)**: Biblioteca UI
- **[TypeScript 5.6](https://www.typescriptlang.org/)**: Superset de JavaScript tipado
- **[Vite 7.3](https://vitejs.dev/)**: Build tool y dev server

### UI & Styling

- **[Material-UI (MUI) 6.2](https://mui.com/)**: Componentes UI
- **[Emotion](https://emotion.sh/)**: CSS-in-JS

### Estado y Datos

- **[Redux Toolkit 2.5](https://redux-toolkit.js.org/)**: Gestión de estado
- **[Axios 1.7](https://axios-http.com/)**: Cliente HTTP

### Routing

- **[React Router 7.1](https://reactrouter.com/)**: Navegación SPA

### Internacionalización

- **[react-i18next 15.2](https://react.i18next.com/)**: i18n framework
- **[i18next 24.2](https://www.i18next.com/)**: Core i18n

### PWA

- **[Vite PWA Plugin 0.21](https://vite-pwa-org.netlify.app/)**: Progressive Web App
- **[Workbox 7.3](https://developer.chrome.com/docs/workbox/)**: Service Workers

---

## 🏗️ Arquitectura

### Gestión de Estado (Redux)

```typescript
store/
├── authSlice      # Autenticación y usuario
├── profileSlice   # Perfiles de CV
└── themeSlice     # Tema y preferencias UI
```

### Flujo de Datos

```
Componente → Dispatch Action → Redux Reducer → Store Update → Re-render
```

### Persistencia

- **localStorage**: User, Token, Theme preferences
- **Redux**: Estado de la aplicación en memoria
- **Backend API**: Datos persistentes

---

## 🎯 Características Principales

### 1. Gestión de Perfiles

```typescript
// Crear un nuevo perfil
POST /api/profiles
{
  "name": "CV Frontend Developer",
  "template": "harvard_modern"
}

// Obtener todos los perfiles
GET /api/profiles

// Actualizar perfil
PUT /api/profiles/:id
```

### 2. Selector de Plantillas

- **Harvard Classic**: Diseño tradicional y elegante
- **Harvard Modern**: Versión contemporánea con elementos visuales

```typescript
// Cambiar plantilla
PATCH /api/profiles/:id/template
{
  "template": "harvard_modern"
}
```

### 3. Esquemas de Colores

10 esquemas organizados en 4 categorías:

**Clásicos:**
- Harvard Crimson
- Oxford Blue
- Burgundy Wine

**Corporativos:**
- Professional Navy

**Modernos:**
- Forest Green
- Slate Gray
- Teal Ocean
- Charcoal Black

**Creativos:**
- Royal Purple
- Sunset Orange

```typescript
// Obtener esquemas
GET /api/color-schemes

// Cambiar esquema
PATCH /api/profiles/:id
{
  "color_scheme": "harvard_crimson"
}
```

### 4. Exportación PDF

```typescript
// Validar perfil
GET /api/profiles/:id/pdf/validate

// Preview PDF
GET /api/profiles/:id/pdf/preview-pdf

// Descargar PDF
GET /api/profiles/:id/pdf/export-pdf
```

---

## 🌍 Internacionalización

### Idiomas Soportados

- 🇪🇸 Español (es)
- 🇬🇧 English (en)

### Uso

```typescript
import { useTranslation } from 'react-i18next';

function Component() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <button onClick={() => i18n.changeLanguage('en')}>
        English
      </button>
    </div>
  );
}
```

### Agregar Traducciones

1. Agregar keys en `src/i18n/locales/es/translation.json`
2. Agregar traducciones en `src/i18n/locales/en/translation.json`
3. Usar con `t('key.path')`

---

## 🎨 Temas y Personalización

### Modo Claro/Oscuro

```typescript
import { useAppDispatch } from '@hooks/useAppDispatch';
import { toggleTheme } from '@redux/slices/themeSlice';

function ThemeToggle() {
  const dispatch = useAppDispatch();

  return (
    <button onClick={() => dispatch(toggleTheme())}>
      Toggle Theme
    </button>
  );
}
```

### Personalizar Colores

Editar `src/theme/theme.ts`:

```typescript
palette: {
  primary: {
    main: '#1976d2',
  },
  secondary: {
    main: '#dc004e',
  },
}
```

---

## 📱 PWA

La aplicación es una Progressive Web App con:

- ✅ Service Worker para cache offline
- ✅ Manifest para instalación
- ✅ Iconos adaptativos
- ✅ Actualización automática

### Configurar PWA

Editar `vite.config.ts`:

```typescript
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/api-cv\.servercontrol-mzt\.com\/.*/i,
        handler: 'NetworkFirst',
      },
    ],
  },
})
```

---

## 🚀 Deployment

### Build para Producción

```bash
npm run build
```

Genera archivos en `dist/`:

```
dist/
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── icon-[hash].svg
├── index.html
├── manifest.webmanifest
└── sw.js
```

### Deploy en Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy en Netlify

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Variables de Entorno en Producción

Configurar en tu plataforma:

```
VITE_API_URL=http://localhost:3000
```

---

## 🔒 Autenticación

### Flujo de Login

```typescript
// 1. Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token",
  "user": { ... }
}

// 2. Almacenar en localStorage
localStorage.setItem('token', accessToken);
localStorage.setItem('user', JSON.stringify(user));

// 3. Incluir en requests
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Servicio de Usuario

```typescript
import { userStorage } from '@utils/userStorage';

// Obtener usuario desde localStorage
const user = userStorage.getUser();

// Verificar autenticación
if (userStorage.isAuthenticated()) {
  // Usuario autenticado
}
```

---

## 🧪 Testing (Futuro)

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

---

## 🐛 Debugging

### Redux DevTools

Instalar extensión: [Redux DevTools](https://github.com/reduxjs/redux-devtools)

### React Developer Tools

Instalar extensión: [React Developer Tools](https://react.dev/learn/react-developer-tools)

### Logs

```typescript
// Habilitar logs de Redux
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: true, // ← Redux DevTools
});
```

---

## 📚 Recursos

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Material-UI Docs](https://mui.com/material-ui/getting-started/)
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [Vite Guide](https://vitejs.dev/guide/)

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Convenciones de Código

- **Naming**: camelCase para variables/funciones, PascalCase para componentes
- **Archivos**: PascalCase para componentes (.tsx), camelCase para utilities (.ts)
- **Imports**: Usar alias `@` para imports absolutos
- **Types**: Definir interfaces en `src/types/index.ts`
- **Commits**: Usar [Conventional Commits](https://www.conventionalcommits.org/)

---

## 📄 Licencia

Este proyecto es privado y confidencial.

---

## 👥 Autores

- **Alexis Diaz** - Desarrollo Frontend

---

## 🙏 Agradecimientos

- Material-UI por los componentes UI
- Redux Toolkit por simplificar el manejo de estado
- Vite por la velocidad de desarrollo
- Comunidad de React por el soporte continuo

---

**¿Preguntas o problemas?** Abre un issue en el repositorio.
