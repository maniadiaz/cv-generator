# Template Preview Images

## Ubicación
Esta carpeta contiene las imágenes de preview de las plantillas de CV.

## Imágenes disponibles

### 1. harvard_classic.png ✅
- **Nombre del archivo:** `harvard_classic.png`
- **Descripción:** Vista previa de la plantilla Harvard Classic
- **Resolución:** 800x1100px (formato A4 proporcional)
- **Formato:** PNG
- **URL pública:** `https://api-cv.servercontrol-mzt.com/templates/previews/harvard_classic.png`

### 2. harvard_modern.png ✅
- **Nombre del archivo:** `harvard_modern.png`
- **Descripción:** Vista previa de la plantilla Harvard Modern
- **Resolución:** 800x1100px (formato A4 proporcional)
- **Formato:** PNG
- **URL pública:** `https://api-cv.servercontrol-mzt.com/templates/previews/harvard_modern.png`

### 3. oxford.png ✅
- **Nombre del archivo:** `oxford.png`
- **Descripción:** Vista previa de la plantilla Oxford
- **Resolución:** 800x1100px (formato A4 proporcional)
- **Formato:** PNG
- **URL pública:** `https://api-cv.servercontrol-mzt.com/templates/previews/oxford.png`

### 4. ats.png ✅
- **Nombre del archivo:** `ats.png`
- **Descripción:** Vista previa de la plantilla ATS Optimized
- **Resolución:** 800x1100px (formato A4 proporcional)
- **Formato:** PNG
- **URL pública:** `https://api-cv.servercontrol-mzt.com/templates/previews/ats.png`

## Cómo generar las imágenes

### Script automatizado (Recomendado)

Ejecuta el script de generación de previews:

```bash
npm run generate:previews
```

O directamente:

```bash
node scripts/generate-template-previews.js
```

Este script genera automáticamente todas las imágenes de preview para las 4 plantillas disponibles.

### Manual

1. **Desde el navegador:**
   - Abre la vista previa del CV: `GET /api/profiles/:id/preview-html`
   - Toma un screenshot de la página completa
   - Redimensiona a 800x1100px

2. **Usando Puppeteer:**
   ```javascript
   const puppeteer = require('puppeteer');

   async function generatePreviewImage() {
     const browser = await puppeteer.launch();
     const page = await browser.newPage();
     await page.setViewport({ width: 800, height: 1100 });
     await page.setContent(htmlContent);
     await page.screenshot({
       path: 'public/templates/previews/harvard_classic.png',
       fullPage: true
     });
     await browser.close();
   }
   ```

## Verificar que las imágenes se sirven correctamente

Después de colocar las imágenes, verifica que se pueden acceder:

```bash
# Local
curl http://localhost:5001/templates/previews/harvard_classic.png

# Producción
curl https://api-cv.servercontrol-mzt.com/templates/previews/harvard_classic.png
```

## Estructura de carpetas

```
backend/
├── public/
│   └── templates/
│       └── previews/
│           ├── harvard_classic.png   ✅ Generado
│           ├── harvard_modern.png    ✅ Generado
│           ├── oxford.png            ✅ Generado
│           ├── ats.png               ✅ Generado
│           └── README.md             ← Este archivo
```

## Tamaños de archivo

- harvard_classic.png: ~398KB
- harvard_modern.png: ~558KB
- oxford.png: ~357KB
- ats.png: ~324KB
