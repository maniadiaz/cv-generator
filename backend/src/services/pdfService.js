const puppeteer = require('puppeteer');
const profileService = require('./profileService');
const templateService = require('./templateService');

// Importar la clase TemplateController para acceder a métodos estáticos
const { TemplateController } = require('../controllers/templateController');

class PdfService {
  /**
   * Generar PDF desde HTML usando Puppeteer
   * @param {string} html - HTML del CV
   * @param {object} options - Opciones de configuración del PDF
   * @returns {Promise<Buffer>} - Buffer del PDF generado
   */
  async generatePdfFromHtml(html, options = {}) {
    let browser;

    try {
      // Configuración de Puppeteer
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();

      // Establecer el contenido HTML
      await page.setContent(html, {
        waitUntil: 'networkidle0'
      });

      // Opciones por defecto del PDF
      const pdfOptions = {
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          bottom: '20mm',
          left: '15mm',
          right: '15mm'
        },
        ...options
      };

      // Generar PDF
      const pdfBuffer = await page.pdf(pdfOptions);

      return pdfBuffer;

    } catch (error) {
      throw new Error(`PDF generation failed: ${error.message}`);
    } finally {
      // Cerrar el navegador
      if (browser) {
        await browser.close();
      }
    }
  }

  /**
   * Exportar perfil completo a PDF
   * @param {number} profileId - ID del perfil
   * @param {number} userId - ID del usuario
   * @returns {Promise<object>} - Buffer del PDF y metadata
   */
  async exportProfileToPdf(profileId, userId) {
    try {
      // Obtener perfil completo con todas las relaciones
      const profile = await profileService.getCompleteProfile(profileId, userId);

      if (!profile) {
        throw new Error('Profile not found or access denied');
      }

      // Obtener metadata de la plantilla
      const templateMetadata = await templateService.getTemplateMetadata(profile.template);

      // Generar HTML del CV usando el TemplateController
      const html = TemplateController.generateHtmlPreview(profile, templateMetadata);

      // Generar PDF desde el HTML
      const pdfBuffer = await this.generatePdfFromHtml(html);

      // Actualizar download_count y last_exported_at
      await profile.incrementDownloadCount();

      // Generar nombre de archivo
      const fileName = this.generateFileName(profile);

      return {
        pdfBuffer,
        fileName,
        profile: {
          id: profile.id,
          name: profile.name,
          download_count: profile.download_count,
          last_exported_at: profile.last_exported_at
        }
      };

    } catch (error) {
      throw new Error(`Export to PDF failed: ${error.message}`);
    }
  }

  /**
   * Generar nombre de archivo para el PDF
   * @param {object} profile - Perfil del CV
   * @returns {string} - Nombre del archivo
   */
  generateFileName(profile) {
    const sanitizedName = profile.name
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-_]/g, '')
      .toLowerCase();

    const timestamp = Date.now();

    return `CV-${sanitizedName}-${timestamp}.pdf`;
  }

  /**
   * Validar que un perfil tiene suficiente información para exportar
   * @param {object} profile - Perfil del CV
   * @returns {object} - Resultado de validación
   */
  validateProfileForExport(profile) {
    const warnings = [];

    // Verificar información personal básica
    if (!profile.personalInfo) {
      warnings.push('Missing personal information');
    } else {
      if (!profile.personalInfo.full_name) {
        warnings.push('Missing full name in personal information');
      }
      if (!profile.personalInfo.email) {
        warnings.push('Missing email in personal information');
      }
    }

    // Verificar que tenga al menos una sección completa
    const hasEducation = profile.education && profile.education.length > 0;
    const hasExperience = profile.experience && profile.experience.length > 0;
    const hasSkills = profile.skills && profile.skills.length > 0;

    if (!hasEducation && !hasExperience && !hasSkills) {
      warnings.push('Profile has no education, experience, or skills sections');
    }

    return {
      isValid: warnings.length === 0,
      warnings,
      canExport: profile.personalInfo && profile.personalInfo.full_name
    };
  }
}

module.exports = new PdfService();
