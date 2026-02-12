/**
 * Esquemas de Colores Predefinidos para Templates de CV
 *
 * Cada esquema incluye:
 * - primary: Color principal para títulos de secciones
 * - text: Color del texto principal/contenido
 * - accent: Color de acentos, enlaces, íconos
 * - headerBg: Color de fondo del encabezado
 * - headerText: Color del texto en el encabezado
 */

const COLOR_SCHEMES = [
  {
    id: 'harvard_crimson',
    name: 'Harvard Crimson',
    description: 'Rojo clásico de Harvard, profesional y elegante',
    category: 'classic',
    colors: {
      primary: '#A51C30',      // Harvard Crimson - Títulos de secciones
      text: '#2C3E50',         // Gris oscuro - Texto principal
      accent: '#C8102E',       // Crimson brillante - Enlaces/acentos
      headerBg: '#A51C30',     // Crimson - Fondo del encabezado
      headerText: '#FFFFFF'    // Blanco - Texto del encabezado
    },
    preview: {
      primary: '#A51C30',
      secondary: '#2C3E50',
      accent: '#C8102E'
    }
  },
  {
    id: 'oxford_blue',
    name: 'Oxford Blue',
    description: 'Azul académico de Oxford, distinguido y confiable',
    category: 'classic',
    colors: {
      primary: '#002147',      // Oxford Blue - Títulos
      text: '#34495E',         // Gris azulado - Texto
      accent: '#C5B87C',       // Dorado Oxford - Acentos
      headerBg: '#002147',     // Oxford Blue - Fondo
      headerText: '#FFFFFF'    // Blanco - Texto
    },
    preview: {
      primary: '#002147',
      secondary: '#34495E',
      accent: '#C5B87C'
    }
  },
  {
    id: 'professional_navy',
    name: 'Professional Navy',
    description: 'Azul marino corporativo, serio y profesional',
    category: 'corporate',
    colors: {
      primary: '#1E3A8A',      // Azul marino - Títulos
      text: '#374151',         // Gris neutro - Texto
      accent: '#3B82F6',       // Azul brillante - Acentos
      headerBg: '#1E3A8A',     // Azul marino - Fondo
      headerText: '#FFFFFF'    // Blanco - Texto
    },
    preview: {
      primary: '#1E3A8A',
      secondary: '#374151',
      accent: '#3B82F6'
    }
  },
  {
    id: 'forest_green',
    name: 'Forest Green',
    description: 'Verde bosque, natural y fresco',
    category: 'modern',
    colors: {
      primary: '#065F46',      // Verde oscuro - Títulos
      text: '#1F2937',         // Gris carbón - Texto
      accent: '#10B981',       // Verde brillante - Acentos
      headerBg: '#065F46',     // Verde oscuro - Fondo
      headerText: '#FFFFFF'    // Blanco - Texto
    },
    preview: {
      primary: '#065F46',
      secondary: '#1F2937',
      accent: '#10B981'
    }
  },
  {
    id: 'slate_gray',
    name: 'Slate Gray',
    description: 'Gris pizarra, minimalista y moderno',
    category: 'modern',
    colors: {
      primary: '#475569',      // Gris pizarra - Títulos
      text: '#1E293B',         // Gris muy oscuro - Texto
      accent: '#64748B',       // Gris medio - Acentos
      headerBg: '#1E293B',     // Gris muy oscuro - Fondo
      headerText: '#FFFFFF'    // Blanco - Texto
    },
    preview: {
      primary: '#475569',
      secondary: '#1E293B',
      accent: '#64748B'
    }
  },
  {
    id: 'royal_purple',
    name: 'Royal Purple',
    description: 'Púrpura real, creativo y sofisticado',
    category: 'creative',
    colors: {
      primary: '#7C3AED',      // Púrpura - Títulos
      text: '#374151',         // Gris oscuro - Texto
      accent: '#A78BFA',       // Púrpura claro - Acentos
      headerBg: '#6D28D9',     // Púrpura oscuro - Fondo
      headerText: '#FFFFFF'    // Blanco - Texto
    },
    preview: {
      primary: '#7C3AED',
      secondary: '#374151',
      accent: '#A78BFA'
    }
  },
  {
    id: 'sunset_orange',
    name: 'Sunset Orange',
    description: 'Naranja atardecer, energético y cálido',
    category: 'creative',
    colors: {
      primary: '#EA580C',      // Naranja - Títulos
      text: '#292524',         // Gris cálido - Texto
      accent: '#FB923C',       // Naranja claro - Acentos
      headerBg: '#C2410C',     // Naranja oscuro - Fondo
      headerText: '#FFFFFF'    // Blanco - Texto
    },
    preview: {
      primary: '#EA580C',
      secondary: '#292524',
      accent: '#FB923C'
    }
  },
  {
    id: 'teal_ocean',
    name: 'Teal Ocean',
    description: 'Verde azulado oceánico, fresco y equilibrado',
    category: 'modern',
    colors: {
      primary: '#0F766E',      // Teal oscuro - Títulos
      text: '#1F2937',         // Gris oscuro - Texto
      accent: '#14B8A6',       // Teal brillante - Acentos
      headerBg: '#0F766E',     // Teal oscuro - Fondo
      headerText: '#FFFFFF'    // Blanco - Texto
    },
    preview: {
      primary: '#0F766E',
      secondary: '#1F2937',
      accent: '#14B8A6'
    }
  },
  {
    id: 'burgundy_wine',
    name: 'Burgundy Wine',
    description: 'Borgoña vino, elegante y maduro',
    category: 'classic',
    colors: {
      primary: '#881337',      // Borgoña - Títulos
      text: '#3F3F46',         // Gris carbón - Texto
      accent: '#BE123C',       // Rosa oscuro - Acentos
      headerBg: '#881337',     // Borgoña - Fondo
      headerText: '#FFFFFF'    // Blanco - Texto
    },
    preview: {
      primary: '#881337',
      secondary: '#3F3F46',
      accent: '#BE123C'
    }
  },
  {
    id: 'charcoal_black',
    name: 'Charcoal Black',
    description: 'Negro carbón, minimalista y sofisticado',
    category: 'modern',
    colors: {
      primary: '#18181B',      // Negro carbón - Títulos
      text: '#3F3F46',         // Gris oscuro - Texto
      accent: '#71717A',       // Gris medio - Acentos
      headerBg: '#09090B',     // Negro puro - Fondo
      headerText: '#FFFFFF'    // Blanco - Texto
    },
    preview: {
      primary: '#18181B',
      secondary: '#3F3F46',
      accent: '#71717A'
    }
  }
];

/**
 * Obtener todos los esquemas de colores
 */
function getAllColorSchemes() {
  return COLOR_SCHEMES;
}

/**
 * Obtener esquema de color por ID
 */
function getColorSchemeById(id) {
  return COLOR_SCHEMES.find(scheme => scheme.id === id);
}

/**
 * Obtener esquemas por categoría
 */
function getColorSchemesByCategory(category) {
  return COLOR_SCHEMES.filter(scheme => scheme.category === category);
}

/**
 * Obtener IDs válidos de esquemas
 */
function getValidSchemeIds() {
  return COLOR_SCHEMES.map(scheme => scheme.id);
}

/**
 * Obtener categorías disponibles
 */
function getCategories() {
  const categories = [...new Set(COLOR_SCHEMES.map(scheme => scheme.category))];
  return categories;
}

/**
 * Verificar si un ID de esquema es válido
 */
function isValidSchemeId(id) {
  return COLOR_SCHEMES.some(scheme => scheme.id === id);
}

/**
 * Obtener colores para un esquema específico
 * Si no se encuentra, devuelve Harvard Crimson por defecto
 */
function getColorsForScheme(schemeId) {
  const scheme = getColorSchemeById(schemeId);
  if (!scheme) {
    // Fallback a Harvard Crimson
    return getColorSchemeById('harvard_crimson').colors;
  }
  return scheme.colors;
}

module.exports = {
  COLOR_SCHEMES,
  getAllColorSchemes,
  getColorSchemeById,
  getColorSchemesByCategory,
  getValidSchemeIds,
  getCategories,
  isValidSchemeId,
  getColorsForScheme
};
