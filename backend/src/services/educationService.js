const { Education, Profile } = require('../models');
const { Op } = require('sequelize');

class EducationService {
  /**
   * Crear nueva educación
   */
  async createEducation(profileId, userId, educationData) {
    // Verificar que el perfil existe y pertenece al usuario
    const profile = await Profile.findOne({
      where: { id: profileId, user_id: userId }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    // Crear educación
    const education = await Education.create({
      profile_id: profileId,
      ...educationData
    });

    // Validar fechas
    education.validateDates();

    return {
      education,
      message: 'Education created successfully'
    };
  }

  /**
   * Obtener todas las educaciones de un perfil
   */
  async getEducationsByProfile(profileId, userId) {
    // Verificar ownership
    const profile = await Profile.findOne({
      where: { id: profileId, user_id: userId }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    const educations = await Education.findAll({
      where: { profile_id: profileId },
      order: [['display_order', 'ASC'], ['start_date', 'DESC']]
    });

    return educations;
  }

  /**
   * Obtener una educación por ID
   */
  async getEducationById(educationId, profileId, userId) {
    // Verificar ownership del perfil
    const profile = await Profile.findOne({
      where: { id: profileId, user_id: userId }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    const education = await Education.findOne({
      where: {
        id: educationId,
        profile_id: profileId
      }
    });

    if (!education) {
      throw new Error('Education not found');
    }

    return education;
  }

  /**
   * Actualizar educación
   */
  async updateEducation(educationId, profileId, userId, updates) {
    const education = await this.getEducationById(educationId, profileId, userId);

    // Campos permitidos para actualizar
    const allowedFields = [
      'institution',
      'degree',
      'field_of_study',
      'start_date',
      'end_date',
      'is_current',
      'grade',
      'description',
      'location',
      'website',
      'is_visible'
    ];

    const updateData = {};
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field];
      }
    });

    await education.update(updateData);

    // Validar fechas después de actualizar
    education.validateDates();

    return {
      education: await this.getEducationById(educationId, profileId, userId),
      message: 'Education updated successfully'
    };
  }

  /**
   * Eliminar educación
   */
  async deleteEducation(educationId, profileId, userId) {
    const education = await this.getEducationById(educationId, profileId, userId);

    await education.destroy();

    // Reordenar las educaciones restantes
    const remainingEducations = await Education.findAll({
      where: { profile_id: profileId },
      order: [['display_order', 'ASC']]
    });

    for (let i = 0; i < remainingEducations.length; i++) {
      await remainingEducations[i].update({ display_order: i });
    }

    return {
      message: 'Education deleted successfully'
    };
  }

  /**
   * Reordenar educaciones
   */
  async reorderEducations(profileId, userId, orderedIds) {
    // Verificar ownership
    const profile = await Profile.findOne({
      where: { id: profileId, user_id: userId }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    // Verificar que todos los IDs pertenecen al perfil
    const educations = await Education.findAll({
      where: {
        id: { [Op.in]: orderedIds },
        profile_id: profileId
      }
    });

    if (educations.length !== orderedIds.length) {
      throw new Error('Some education IDs are invalid or do not belong to this profile');
    }

    // Reordenar
    await Education.reorder(profileId, orderedIds);

    return {
      message: 'Education reordered successfully'
    };
  }

  /**
   * Toggle visibility de educación
   */
  async toggleVisibility(educationId, profileId, userId) {
    const education = await this.getEducationById(educationId, profileId, userId);

    await education.update({
      is_visible: !education.is_visible
    });

    return {
      education,
      message: `Education ${education.is_visible ? 'shown' : 'hidden'} successfully`
    };
  }

  /**
   * Obtener estadísticas de educación de un perfil
   */
  async getEducationStats(profileId, userId) {
    // Verificar ownership
    const profile = await Profile.findOne({
      where: { id: profileId, user_id: userId }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    const educations = await Education.findAll({
      where: { profile_id: profileId }
    });

    const total = educations.length;
    const visible = educations.filter(e => e.is_visible).length;
    const current = educations.filter(e => e.is_current).length;
    const completed = educations.filter(e => !e.is_current).length;

    return {
      total,
      visible,
      hidden: total - visible,
      current,
      completed
    };
  }
}

module.exports = new EducationService();
