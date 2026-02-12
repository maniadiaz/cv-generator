const { Profile } = require('../models');

class ProfileCompletionService {
  /**
   * Obtener el porcentaje de completitud del perfil
   */
  async getProfileCompletion(profileId, userId) {
    // Verificar que el perfil existe y pertenece al usuario
    const profile = await Profile.findOne({
      where: { id: profileId, user_id: userId }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    // Calcular el porcentaje de completitud
    const percentage = await profile.calculateCompletionPercentage();

    // Obtener las secciones faltantes
    const missingSections = await profile.getMissingSections();

    return {
      percentage,
      missingSections
    };
  }
}

module.exports = new ProfileCompletionService();
