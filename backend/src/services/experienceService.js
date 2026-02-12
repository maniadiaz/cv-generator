const { Experience, Profile } = require('../models');
const { Op } = require('sequelize');

class ExperienceService {
  /**
   * Crear nueva experiencia
   */
  async createExperience(profileId, userId, experienceData) {
    // Verificar que el perfil existe y pertenece al usuario
    const profile = await Profile.findOne({
      where: { id: profileId, user_id: userId }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    // Convertir arrays a JSON strings si es necesario
    if (experienceData.technologies && Array.isArray(experienceData.technologies)) {
      experienceData.technologies = JSON.stringify(experienceData.technologies);
    }

    if (experienceData.achievements && Array.isArray(experienceData.achievements)) {
      experienceData.achievements = JSON.stringify(experienceData.achievements);
    }

    // Crear experiencia
    const experience = await Experience.create({
      profile_id: profileId,
      ...experienceData
    });

    // Validar fechas
    experience.validateDates();

    return {
      experience,
      message: 'Experience created successfully'
    };
  }

  /**
   * Obtener todas las experiencias de un perfil
   */
  async getExperiencesByProfile(profileId, userId) {
    // Verificar ownership
    const profile = await Profile.findOne({
      where: { id: profileId, user_id: userId }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    const experiences = await Experience.findAll({
      where: { profile_id: profileId },
      order: [['display_order', 'ASC'], ['start_date', 'DESC']]
    });

    return experiences;
  }

  /**
   * Obtener una experiencia por ID
   */
  async getExperienceById(experienceId, profileId, userId) {
    // Verificar ownership del perfil
    const profile = await Profile.findOne({
      where: { id: profileId, user_id: userId }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    const experience = await Experience.findOne({
      where: {
        id: experienceId,
        profile_id: profileId
      }
    });

    if (!experience) {
      throw new Error('Experience not found');
    }

    return experience;
  }

  /**
   * Actualizar experiencia
   */
  async updateExperience(experienceId, profileId, userId, updates) {
    const experience = await this.getExperienceById(experienceId, profileId, userId);

    // Convertir arrays a JSON strings si es necesario
    if (updates.technologies && Array.isArray(updates.technologies)) {
      updates.technologies = JSON.stringify(updates.technologies);
    }

    if (updates.achievements && Array.isArray(updates.achievements)) {
      updates.achievements = JSON.stringify(updates.achievements);
    }

    // Campos permitidos para actualizar
    const allowedFields = [
      'project_title',
      'position',
      'company',
      'company_website',
      'employment_type',
      'location',
      'location_type',
      'start_date',
      'end_date',
      'is_current',
      'description',
      'achievements',
      'technologies',
      'project_url',
      'is_visible'
    ];

    const updateData = {};
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field];
      }
    });

    await experience.update(updateData);

    // Validar fechas después de actualizar
    experience.validateDates();

    return {
      experience: await this.getExperienceById(experienceId, profileId, userId),
      message: 'Experience updated successfully'
    };
  }

  /**
   * Eliminar experiencia
   */
  async deleteExperience(experienceId, profileId, userId) {
    const experience = await this.getExperienceById(experienceId, profileId, userId);

    await experience.destroy();

    // Reordenar las experiencias restantes
    const remainingExperiences = await Experience.findAll({
      where: { profile_id: profileId },
      order: [['display_order', 'ASC']]
    });

    for (let i = 0; i < remainingExperiences.length; i++) {
      await remainingExperiences[i].update({ display_order: i });
    }

    return {
      message: 'Experience deleted successfully'
    };
  }

  /**
   * Reordenar experiencias
   */
  async reorderExperiences(profileId, userId, orderedIds) {
    // Verificar ownership
    const profile = await Profile.findOne({
      where: { id: profileId, user_id: userId }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    // Verificar que todos los IDs pertenecen al perfil
    const experiences = await Experience.findAll({
      where: {
        id: { [Op.in]: orderedIds },
        profile_id: profileId
      }
    });

    if (experiences.length !== orderedIds.length) {
      throw new Error('Some experience IDs are invalid or do not belong to this profile');
    }

    // Reordenar
    await Experience.reorder(profileId, orderedIds);

    return {
      message: 'Experience reordered successfully'
    };
  }

  /**
   * Toggle visibility de experiencia
   */
  async toggleVisibility(experienceId, profileId, userId) {
    const experience = await this.getExperienceById(experienceId, profileId, userId);

    await experience.update({
      is_visible: !experience.is_visible
    });

    return {
      experience,
      message: `Experience ${experience.is_visible ? 'shown' : 'hidden'} successfully`
    };
  }

  /**
   * Obtener estadísticas de experiencia de un perfil
   */
  async getExperienceStats(profileId, userId) {
    // Verificar ownership
    const profile = await Profile.findOne({
      where: { id: profileId, user_id: userId }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    const experiences = await Experience.findAll({
      where: { profile_id: profileId }
    });

    const total = experiences.length;
    const visible = experiences.filter(e => e.is_visible).length;
    const current = experiences.filter(e => e.is_current).length;
    const completed = experiences.filter(e => !e.is_current).length;

    // Calcular experiencia total en meses
    const totalExperienceMonths = experiences.reduce((sum, exp) => {
      return sum + exp.getDuration().totalMonths;
    }, 0);

    const years = Math.floor(totalExperienceMonths / 12);
    const months = totalExperienceMonths % 12;

    return {
      total,
      visible,
      hidden: total - visible,
      current,
      completed,
      totalExperience: {
        years,
        months,
        totalMonths: totalExperienceMonths,
        formatted: years > 0
          ? `${years} ${years === 1 ? 'año' : 'años'}${months > 0 ? ` ${months} ${months === 1 ? 'mes' : 'meses'}` : ''}`
          : `${months} ${months === 1 ? 'mes' : 'meses'}`
      }
    };
  }
}

module.exports = new ExperienceService();
