/**
 * Configuración centralizada de categorías de habilidades
 * Este archivo define todas las categorías disponibles para skills
 * y puede ser consumido tanto por el backend como retornado al frontend
 */

const SKILL_CATEGORIES = [
  // Tecnología y Desarrollo
  {
    value: 'programming_languages',
    label: 'Lenguajes de Programación',
    description: 'Lenguajes como JavaScript, Python, Java, etc.',
    icon: 'code',
    examples: ['JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'Go']
  },
  {
    value: 'frameworks_libraries',
    label: 'Frameworks y Librerías',
    description: 'Frameworks y librerías de desarrollo',
    icon: 'library',
    examples: ['React', 'Vue', 'Angular', 'Django', 'Spring', 'Express']
  },
  {
    value: 'databases',
    label: 'Bases de Datos',
    description: 'Sistemas de gestión de bases de datos',
    icon: 'database',
    examples: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Oracle']
  },
  {
    value: 'cloud_devops',
    label: 'Cloud y DevOps',
    description: 'Servicios cloud, CI/CD, contenedores',
    icon: 'cloud',
    examples: ['AWS', 'Docker', 'Kubernetes', 'Azure', 'Jenkins', 'Terraform']
  },
  {
    value: 'mobile_development',
    label: 'Desarrollo Móvil',
    description: 'Desarrollo de aplicaciones móviles',
    icon: 'smartphone',
    examples: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android']
  },

  // Diseño y Creatividad
  {
    value: 'design_tools',
    label: 'Herramientas de Diseño',
    description: 'Software de diseño gráfico y UX/UI',
    icon: 'palette',
    examples: ['Figma', 'Adobe Photoshop', 'Illustrator', 'Sketch', 'InDesign']
  },
  {
    value: 'multimedia',
    label: 'Multimedia y Video',
    description: 'Edición de video, audio y animación',
    icon: 'video',
    examples: ['Premiere Pro', 'After Effects', 'Final Cut', 'Blender', 'DaVinci Resolve']
  },
  {
    value: 'graphic_design',
    label: 'Diseño Gráfico',
    description: 'Diseño visual, branding, tipografía',
    icon: 'image',
    examples: ['Branding', 'Tipografía', 'Ilustración', 'UI Design', 'Motion Graphics']
  },

  // Negocios y Gestión
  {
    value: 'project_management',
    label: 'Gestión de Proyectos',
    description: 'Metodologías y herramientas de gestión',
    icon: 'briefcase',
    examples: ['Scrum', 'Agile', 'Jira', 'Trello', 'Monday.com', 'Asana']
  },
  {
    value: 'business_analysis',
    label: 'Análisis de Negocios',
    description: 'Análisis de datos, métricas, KPIs',
    icon: 'trending-up',
    examples: ['Business Intelligence', 'Data Analysis', 'Excel Avanzado', 'Power BI', 'Tableau']
  },
  {
    value: 'marketing_digital',
    label: 'Marketing Digital',
    description: 'SEO, SEM, redes sociales, email marketing',
    icon: 'megaphone',
    examples: ['SEO', 'Google Ads', 'Facebook Ads', 'Email Marketing', 'Analytics']
  },
  {
    value: 'sales',
    label: 'Ventas',
    description: 'Técnicas de ventas, CRM, negociación',
    icon: 'shopping-cart',
    examples: ['Salesforce', 'HubSpot', 'Negociación', 'Cold Calling', 'Account Management']
  },

  // Finanzas y Contabilidad
  {
    value: 'accounting',
    label: 'Contabilidad',
    description: 'Contabilidad, auditoría, impuestos',
    icon: 'calculator',
    examples: ['QuickBooks', 'SAP', 'Auditoría', 'IFRS', 'Contabilidad Fiscal']
  },
  {
    value: 'finance',
    label: 'Finanzas',
    description: 'Análisis financiero, inversiones, riesgo',
    icon: 'dollar-sign',
    examples: ['Análisis Financiero', 'Inversiones', 'Excel Financiero', 'Bloomberg', 'Risk Management']
  },

  // Recursos Humanos
  {
    value: 'human_resources',
    label: 'Recursos Humanos',
    description: 'Reclutamiento, desarrollo organizacional',
    icon: 'users',
    examples: ['Reclutamiento', 'Onboarding', 'Gestión del Talento', 'Workday', 'BambooHR']
  },

  // Salud y Ciencias
  {
    value: 'healthcare',
    label: 'Salud',
    description: 'Medicina, enfermería, terapias',
    icon: 'heart',
    examples: ['Diagnóstico', 'Primeros Auxilios', 'Historia Clínica', 'Procedimientos Médicos']
  },
  {
    value: 'laboratory',
    label: 'Laboratorio',
    description: 'Técnicas de laboratorio, análisis clínicos',
    icon: 'flask',
    examples: ['Análisis Clínicos', 'Microbiología', 'Bioquímica', 'Instrumentación de Laboratorio']
  },

  // Educación
  {
    value: 'teaching',
    label: 'Enseñanza',
    description: 'Metodologías pedagógicas, didáctica',
    icon: 'book-open',
    examples: ['Diseño Curricular', 'Evaluación Educativa', 'Classroom Management', 'E-learning']
  },

  // Legal
  {
    value: 'legal',
    label: 'Legal',
    description: 'Derecho, litigio, contratos',
    icon: 'scale',
    examples: ['Derecho Corporativo', 'Litigio', 'Contratos', 'Compliance', 'Propiedad Intelectual']
  },

  // Operaciones y Logística
  {
    value: 'operations',
    label: 'Operaciones',
    description: 'Gestión de operaciones, procesos',
    icon: 'settings',
    examples: ['Lean Manufacturing', 'Six Sigma', 'Gestión de Procesos', 'Mejora Continua']
  },
  {
    value: 'logistics',
    label: 'Logística',
    description: 'Cadena de suministro, inventarios',
    icon: 'truck',
    examples: ['Supply Chain', 'Gestión de Inventarios', 'Planificación', 'Distribución', 'SAP MM']
  },

  // Construcción y Arquitectura
  {
    value: 'architecture',
    label: 'Arquitectura',
    description: 'Diseño arquitectónico, construcción',
    icon: 'home',
    examples: ['AutoCAD', 'Revit', 'SketchUp', 'Diseño Arquitectónico', 'BIM']
  },
  {
    value: 'engineering',
    label: 'Ingeniería',
    description: 'Ingeniería civil, mecánica, eléctrica',
    icon: 'tool',
    examples: ['CAD', 'MATLAB', 'SolidWorks', 'Diseño Estructural', 'Análisis de Esfuerzos']
  },

  // Comunicación y Medios
  {
    value: 'communication',
    label: 'Comunicación',
    description: 'Redacción, relaciones públicas, periodismo',
    icon: 'message-circle',
    examples: ['Redacción', 'Copywriting', 'Relaciones Públicas', 'Comunicación Corporativa']
  },
  {
    value: 'social_media',
    label: 'Redes Sociales',
    description: 'Gestión de comunidades, content creation',
    icon: 'share-2',
    examples: ['Community Management', 'Content Creation', 'Instagram', 'TikTok', 'LinkedIn']
  },

  // Atención al Cliente
  {
    value: 'customer_service',
    label: 'Atención al Cliente',
    description: 'Servicio al cliente, soporte técnico',
    icon: 'headphones',
    examples: ['Zendesk', 'Freshdesk', 'Resolución de Conflictos', 'Soporte Técnico']
  },

  // Habilidades Generales y Herramientas
  {
    value: 'office_tools',
    label: 'Herramientas de Oficina',
    description: 'Suite de oficina, productividad',
    icon: 'file-text',
    examples: ['Microsoft Office', 'Google Workspace', 'Excel', 'PowerPoint', 'Word']
  },
  {
    value: 'soft_skills',
    label: 'Habilidades Blandas',
    description: 'Liderazgo, trabajo en equipo, comunicación',
    icon: 'award',
    examples: ['Liderazgo', 'Trabajo en Equipo', 'Comunicación', 'Resolución de Problemas', 'Adaptabilidad']
  },
  {
    value: 'languages',
    label: 'Idiomas',
    description: 'Idiomas adicionales (complemento a sección de idiomas)',
    icon: 'globe',
    examples: ['Traducción', 'Interpretación', 'Redacción Técnica']
  },

  // Categoría genérica
  {
    value: 'other',
    label: 'Otros',
    description: 'Otras habilidades no categorizadas',
    icon: 'more-horizontal',
    examples: []
  }
];

/**
 * Obtener array simple de valores de categorías para validación
 */
function getCategoryValues() {
  return SKILL_CATEGORIES.map(cat => cat.value);
}

/**
 * Obtener categoría por valor
 */
function getCategoryByValue(value) {
  return SKILL_CATEGORIES.find(cat => cat.value === value);
}

/**
 * Obtener categorías agrupadas por tema
 */
function getCategoriesGrouped() {
  return {
    'Tecnología': SKILL_CATEGORIES.filter(cat =>
      ['programming_languages', 'frameworks_libraries', 'databases', 'cloud_devops', 'mobile_development'].includes(cat.value)
    ),
    'Diseño y Creatividad': SKILL_CATEGORIES.filter(cat =>
      ['design_tools', 'multimedia', 'graphic_design'].includes(cat.value)
    ),
    'Negocios': SKILL_CATEGORIES.filter(cat =>
      ['project_management', 'business_analysis', 'marketing_digital', 'sales'].includes(cat.value)
    ),
    'Finanzas': SKILL_CATEGORIES.filter(cat =>
      ['accounting', 'finance'].includes(cat.value)
    ),
    'Recursos Humanos': SKILL_CATEGORIES.filter(cat =>
      ['human_resources'].includes(cat.value)
    ),
    'Salud': SKILL_CATEGORIES.filter(cat =>
      ['healthcare', 'laboratory'].includes(cat.value)
    ),
    'Educación': SKILL_CATEGORIES.filter(cat =>
      ['teaching'].includes(cat.value)
    ),
    'Legal': SKILL_CATEGORIES.filter(cat =>
      ['legal'].includes(cat.value)
    ),
    'Operaciones': SKILL_CATEGORIES.filter(cat =>
      ['operations', 'logistics'].includes(cat.value)
    ),
    'Construcción e Ingeniería': SKILL_CATEGORIES.filter(cat =>
      ['architecture', 'engineering'].includes(cat.value)
    ),
    'Comunicación': SKILL_CATEGORIES.filter(cat =>
      ['communication', 'social_media'].includes(cat.value)
    ),
    'Servicio': SKILL_CATEGORIES.filter(cat =>
      ['customer_service'].includes(cat.value)
    ),
    'General': SKILL_CATEGORIES.filter(cat =>
      ['office_tools', 'soft_skills', 'languages', 'other'].includes(cat.value)
    )
  };
}

module.exports = {
  SKILL_CATEGORIES,
  getCategoryValues,
  getCategoryByValue,
  getCategoriesGrouped
};
