# Previews de Templates

Este directorio contiene archivos HTML de preview para cada plantilla disponible.

## Archivos Generados

Los siguientes archivos se generan automáticamente con el comando `npm run generate:html`:

- `harvard_classic.html` - Preview del template Harvard Classic
- `harvard_modern.html` - Preview del template Harvard Modern
- `oxford.html` - Preview del template Oxford

## Cómo Generar los Previews

```bash
npm run generate:html
```

Este comando:
1. Crea archivos HTML con datos de ejemplo
2. Aplica los estilos de cada plantilla
3. Guarda los archivos en este directorio

## Cómo Ver los Previews

Simplemente abre cualquiera de los archivos `.html` en tu navegador:

- Windows: Doble click en el archivo
- Mac/Linux: `open archivo.html` o arrastra el archivo al navegador

## Nota

Estos archivos están en `.gitignore` porque se generan automáticamente. No los edites manualmente.

Para modificar los templates, edita:
- `src/controllers/templateController.js` - Lógica de generación
- `src/services/templateService.js` - Definiciones de templates
