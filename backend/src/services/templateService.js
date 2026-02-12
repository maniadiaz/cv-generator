const { Profile } = require('../models');

class TemplateService {
  /**
   * Definición de plantillas disponibles con su metadata
   */
  getTemplateDefinitions() {
    return {
      harvard_classic: {
        name: 'harvard_classic',
        displayName: 'Harvard Classic',
        description: 'Plantilla tradicional inspirada en el formato Harvard',
        category: 'professional',
        previewImage: '/templates/previews/harvard_classic.png',
        colors: {
          primary: '#A51C30',   // Harvard Crimson
          secondary: '#000000',
          accent: '#8C1515'
        },
        features: ['Traditional layout', 'Clean typography', 'ATS-friendly']
      },
      harvard_modern: {
        name: 'harvard_modern',
        displayName: 'Harvard Modern',
        description: 'Versión moderna del estilo Harvard con elementos contemporáneos',
        category: 'professional',
        previewImage: '/templates/previews/harvard_modern.png',
        colors: {
          primary: '#A51C30',   // Harvard Crimson
          secondary: '#2C3E50',
          accent: '#E74C3C'
        },
        features: ['Modern design', 'Visual sections', 'Bold headers', 'ATS-friendly']
      },
      oxford: {
        name: 'oxford',
        displayName: 'Oxford',
        description: 'Plantilla elegante inspirada en el estilo académico de Oxford',
        category: 'academic',
        previewImage: '/templates/previews/oxford.png',
        colors: {
          primary: '#002147',   // Oxford Blue
          secondary: '#A79B84',  // Oxford Stone
          accent: '#C5B87C'      // Oxford Gold
        },
        features: ['Academic style', 'Elegant typography', 'Two-column layout', 'Distinguished look']
      },
      ats: {
        name: 'ats',
        displayName: 'ATS Optimized',
        description: 'Plantilla optimizada para sistemas de seguimiento de candidatos (ATS)',
        category: 'professional',
        previewImage: '/templates/previews/ats.png',
        colors: {
          primary: '#000000',   // Black for maximum readability
          secondary: '#333333',
          accent: '#666666'
        },
        features: ['ATS-optimized', 'Clean formatting', 'Machine-readable', 'No graphics', 'Maximum compatibility']
      }
    };
  }

  /**
   * Obtener lista de plantillas disponibles
   * @returns {Array} - Array de plantillas con metadata
   */
  async getAvailableTemplates() {
    const templates = this.getTemplateDefinitions();

    return Object.values(templates).map(template => ({
      name: template.name,
      displayName: template.displayName,
      description: template.description,
      category: template.category,
      previewImage: template.previewImage,
      colors: template.colors,
      features: template.features
    }));
  }

  /**
   * Obtener metadata de una plantilla específica
   * @param {string} templateName - Nombre de la plantilla
   * @returns {object} - Metadata de la plantilla
   */
  async getTemplateMetadata(templateName) {
    const templates = this.getTemplateDefinitions();
    const template = templates[templateName];

    if (!template) {
      throw new Error(`Template '${templateName}' not found`);
    }

    return template;
  }

  /**
   * Cambiar la plantilla de un perfil
   * @param {number} profileId - ID del perfil
   * @param {number} userId - ID del usuario (para verificar ownership)
   * @param {string} templateName - Nombre de la nueva plantilla
   * @returns {Promise<object>} - Perfil actualizado
   */
  async changeProfileTemplate(profileId, userId, templateName) {
    // Verificar que la plantilla existe
    const templates = this.getTemplateDefinitions();
    if (!templates[templateName]) {
      throw new Error(`Template '${templateName}' not found`);
    }

    // Verificar que el perfil existe y pertenece al usuario
    const profile = await Profile.findOne({
      where: {
        id: profileId,
        user_id: userId
      }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    // Actualizar la plantilla
    await profile.update({ template: templateName });

    return {
      profile: await Profile.findByPk(profileId),
      template: templates[templateName],
      message: `Template changed to '${templates[templateName].displayName}' successfully`
    };
  }

  /**
   * Validar que un nombre de plantilla es válido
   * @param {string} templateName - Nombre de la plantilla a validar
   * @returns {boolean} - True si es válida, false si no
   */
  isValidTemplate(templateName) {
    const templates = this.getTemplateDefinitions();
    return templates.hasOwnProperty(templateName);
  }

  /**
   * Obtener plantilla por defecto
   * @returns {string} - Nombre de la plantilla por defecto
   */
  getDefaultTemplate() {
    return 'harvard_classic';
  }
}

module.exports = new TemplateService();
