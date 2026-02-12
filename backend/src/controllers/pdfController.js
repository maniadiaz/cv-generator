const pdfService = require('../services/pdfService');
const ApiResponse = require('../utils/response');
const logger = require('../utils/logger');

class PdfController {
  /**
   * GET /api/profiles/:profileId/pdf/export-pdf
   * Exportar perfil a PDF y descargarlo
   */
  async exportPdf(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);

      // Exportar perfil a PDF
      const result = await pdfService.exportProfileToPdf(profileId, userId);

      // Configurar headers para descarga
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${result.fileName}"`);
      res.setHeader('Content-Length', result.pdfBuffer.length);

      // IMPORTANTE: Usar res.end() en lugar de res.send() para enviar datos binarios
      // res.send() puede convertir el Buffer a JSON
      return res.end(result.pdfBuffer, 'binary');

    } catch (error) {
      logger.error('Export PDF error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      if (error.message.includes('PDF generation failed')) {
        return ApiResponse.error(res, 'Failed to generate PDF. Please try again.', 500);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * GET /api/profiles/:profileId/pdf/preview-pdf
   * Ver PDF en el navegador (inline)
   */
  async previewPdf(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);

      // Exportar perfil a PDF
      const result = await pdfService.exportProfileToPdf(profileId, userId);

      // Configurar headers para vista previa inline
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${result.fileName}"`);
      res.setHeader('Content-Length', result.pdfBuffer.length);

      // IMPORTANTE: Usar res.end() en lugar de res.send() para enviar datos binarios
      // res.send() puede convertir el Buffer a JSON
      return res.end(result.pdfBuffer, 'binary');

    } catch (error) {
      logger.error('Preview PDF error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      if (error.message.includes('PDF generation failed')) {
        return ApiResponse.error(res, 'Failed to generate PDF preview. Please try again.', 500);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * GET /api/profiles/:profileId/pdf/validate
   * Validar que el perfil está listo para exportar
   */
  async validateProfile(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.profileId);

      // Obtener perfil completo
      const profileService = require('../services/profileService');
      const profile = await profileService.getCompleteProfile(profileId, userId);

      // Validar perfil
      const validation = pdfService.validateProfileForExport(profile);

      return ApiResponse.success(res, {
        validation,
        profile: {
          id: profile.id,
          name: profile.name,
          completion_percentage: profile.completion_percentage
        }
      }, 'Profile validation completed');

    } catch (error) {
      logger.error('Validate profile error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }
}

module.exports = new PdfController();
