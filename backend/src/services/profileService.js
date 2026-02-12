const { Profile, PersonalInfo, User } = require('../models');
const { Op } = require('sequelize');

class ProfileService {
  /**
   * Crear nuevo perfil para un usuario
   * @param {number} userId - ID del usuario
   * @param {object} profileData - Datos del perfil
   * @returns {Promise<object>} - Perfil creado con información personal
   */
  async createProfile(userId, profileData) {
    const { name, template, language, color_scheme, is_default, personalInfo } = profileData;

    // Verificar si el usuario existe
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Si es el primer perfil, marcarlo como default automáticamente
    const existingProfiles = await Profile.count({ where: { user_id: userId } });
    const shouldBeDefault = existingProfiles === 0 || is_default;

    // Crear perfil
    const profile = await Profile.create({
      user_id: userId,
      name: name || 'Mi CV',
      template: template || 'harvard_classic',
      language: language || 'es',
      color_scheme: color_scheme || 'harvard_crimson',
      is_default: shouldBeDefault
    });

    // Crear información personal si se proporciona
    let createdPersonalInfo = null;
    if (personalInfo) {
      createdPersonalInfo = await PersonalInfo.create({
        profile_id: profile.id,
        ...personalInfo
      });

      // Calcular y actualizar porcentaje de completitud
      const completionPercentage = createdPersonalInfo.getCompletionPercentage();
      await profile.update({ completion_percentage: completionPercentage });
    }

    // Retornar perfil con información personal
    const createdProfile = await Profile.findByPk(profile.id, {
      include: [
        {
          model: PersonalInfo,
          as: 'personalInfo'
        }
      ]
    });

    return {
      profile: createdProfile,
      message: 'Profile created successfully'
    };
  }

  /**
   * Obtener todos los perfiles de un usuario
   * @param {number} userId - ID del usuario
   * @returns {Promise<Array>} - Lista de perfiles
   */
  async getUserProfiles(userId) {
    const profiles = await Profile.findAll({
      where: { user_id: userId },
      include: [
        {
          model: PersonalInfo,
          as: 'personalInfo',
          attributes: ['full_name', 'professional_title', 'email', 'phone']
        }
      ],
      order: [
        ['is_default', 'DESC'],
        ['updated_at', 'DESC']
      ]
    });

    return profiles;
  }

  /**
   * Obtener un perfil por ID
   * @param {number} profileId - ID del perfil
   * @param {number} userId - ID del usuario (para verificar ownership)
   * @returns {Promise<object>} - Perfil encontrado
   */
  async getProfileById(profileId, userId) {
    const profile = await Profile.findOne({
      where: {
        id: profileId,
        user_id: userId
      },
      include: [
        {
          model: PersonalInfo,
          as: 'personalInfo'
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'first_name', 'last_name']
        }
      ]
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    return profile;
  }

  /**
   * Actualizar un perfil
   * @param {number} profileId - ID del perfil
   * @param {number} userId - ID del usuario
   * @param {object} updates - Datos a actualizar
   * @returns {Promise<object>} - Perfil actualizado
   */
  async updateProfile(profileId, userId, updates) {
    const profile = await this.getProfileById(profileId, userId);

    // Campos permitidos para actualizar
    const allowedFields = [
      'name',
      'template',
      'language',
      'color_scheme',
      'is_public'
    ];

    const updateData = {};
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field];
      }
    });

    // Si se cambia el nombre, resetear el slug para que se regenere
    if (updateData.name) {
      updateData.slug = null;
    }

    await profile.update(updateData);

    // Retornar perfil actualizado
    return await this.getProfileById(profileId, userId);
  }

  /**
   * Eliminar un perfil
   * @param {number} profileId - ID del perfil
   * @param {number} userId - ID del usuario
   * @returns {Promise<object>} - Mensaje de confirmación
   */
  async deleteProfile(profileId, userId) {
    const profile = await this.getProfileById(profileId, userId);

    const wasDefault = profile.is_default;
    await profile.destroy();

    // Si era el perfil por defecto, marcar otro como default
    if (wasDefault) {
      const remainingProfiles = await Profile.findAll({
        where: { user_id: userId },
        order: [['updated_at', 'DESC']],
        limit: 1
      });

      if (remainingProfiles.length > 0) {
        await remainingProfiles[0].update({ is_default: true });
      }
    }

    return {
      message: 'Profile deleted successfully'
    };
  }

  /**
   * Marcar un perfil como default
   * @param {number} profileId - ID del perfil
   * @param {number} userId - ID del usuario
   * @returns {Promise<object>} - Perfil actualizado
   */
  async setDefaultProfile(profileId, userId) {
    const profile = await this.getProfileById(profileId, userId);
    await profile.setAsDefault();

    return {
      profile: await this.getProfileById(profileId, userId),
      message: 'Profile set as default successfully'
    };
  }

  /**
   * Actualizar información personal de un perfil
   * @param {number} profileId - ID del perfil
   * @param {number} userId - ID del usuario
   * @param {object} personalInfoData - Datos de información personal
   * @returns {Promise<object>} - Información personal actualizada
   */
  async updatePersonalInfo(profileId, userId, personalInfoData) {
    const profile = await this.getProfileById(profileId, userId);

    let personalInfo = await PersonalInfo.findOne({
      where: { profile_id: profileId }
    });

    if (!personalInfo) {
      // Crear si no existe
      personalInfo = await PersonalInfo.create({
        profile_id: profileId,
        ...personalInfoData
      });
    } else {
      // Actualizar si existe
      await personalInfo.update(personalInfoData);
    }

    // Actualizar porcentaje de completitud del perfil
    const completionPercentage = personalInfo.getCompletionPercentage();
    await profile.update({ completion_percentage: completionPercentage });

    return {
      personalInfo: await PersonalInfo.findOne({
        where: { profile_id: profileId }
      }),
      completionPercentage,
      message: 'Personal information updated successfully'
    };
  }

  /**
   * Obtener información personal de un perfil
   * @param {number} profileId - ID del perfil
   * @param {number} userId - ID del usuario
   * @returns {Promise<object>} - Información personal
   */
  async getPersonalInfo(profileId, userId) {
    await this.getProfileById(profileId, userId); // Verificar ownership

    const personalInfo = await PersonalInfo.findOne({
      where: { profile_id: profileId }
    });

    if (!personalInfo) {
      throw new Error('Personal information not found');
    }

    return personalInfo;
  }

  /**
   * Obtener perfil completo con todas las relaciones
   * Optimizado con eager loading para obtener todo en 1 query
   * @param {number} profileId - ID del perfil
   * @param {number} userId - ID del usuario
   * @returns {Promise<object>} - Perfil completo con todas las relaciones
   */
  async getCompleteProfile(profileId, userId) {
    const { Education, Experience, Skill, Language, Certification, SocialNetwork } = require('../models');

    const profile = await Profile.findOne({
      where: {
        id: profileId,
        user_id: userId
      },
      include: [
        {
          model: PersonalInfo,
          as: 'personalInfo'
        },
        {
          model: Education,
          as: 'education',
          order: [['display_order', 'ASC']],
          separate: true // Para evitar problemas con order en el include principal
        },
        {
          model: Experience,
          as: 'experience',
          order: [['display_order', 'ASC']],
          separate: true
        },
        {
          model: Skill,
          as: 'skills',
          order: [['category', 'ASC'], ['display_order', 'ASC']],
          separate: true
        },
        {
          model: Language,
          as: 'languages',
          order: [['display_order', 'ASC']],
          separate: true
        },
        {
          model: Certification,
          as: 'certifications',
          order: [['display_order', 'ASC']],
          separate: true
        },
        {
          model: SocialNetwork,
          as: 'socialNetworks',
          order: [['display_order', 'ASC']],
          separate: true
        }
      ]
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    // Calcular completitud actual antes de devolver
    await profile.calculateCompletionPercentage();

    return profile;
  }

  /**
   * Duplicar un perfil existente
   * @param {number} profileId - ID del perfil a duplicar
   * @param {number} userId - ID del usuario
   * @returns {Promise<object>} - Nuevo perfil duplicado
   */
  async duplicateProfile(profileId, userId) {
    const originalProfile = await this.getProfileById(profileId, userId);

    // Crear copia del perfil
    const duplicatedProfile = await Profile.create({
      user_id: userId,
      name: `${originalProfile.name} (Copy)`,
      template: originalProfile.template,
      language: originalProfile.language,
      color_scheme: originalProfile.color_scheme,
      is_default: false,
      is_public: false
    });

    // Duplicar información personal si existe
    const originalPersonalInfo = await PersonalInfo.findOne({
      where: { profile_id: profileId }
    });

    if (originalPersonalInfo) {
      const personalInfoData = originalPersonalInfo.toJSON();
      delete personalInfoData.id;
      delete personalInfoData.profile_id;
      delete personalInfoData.created_at;
      delete personalInfoData.updated_at;

      await PersonalInfo.create({
        profile_id: duplicatedProfile.id,
        ...personalInfoData
      });
    }

    return {
      profile: await this.getProfileById(duplicatedProfile.id, userId),
      message: 'Profile duplicated successfully'
    };
  }

  /**
   * Calcular estadísticas de perfiles de un usuario
   * @param {number} userId - ID del usuario
   * @returns {Promise<object>} - Estadísticas
   */
  async getProfileStats(userId) {
    const profiles = await Profile.findAll({
      where: { user_id: userId }
    });

    const totalProfiles = profiles.length;
    const totalViews = profiles.reduce((sum, p) => sum + p.view_count, 0);
    const totalDownloads = profiles.reduce((sum, p) => sum + p.download_count, 0);
    const avgCompletion = profiles.length > 0
      ? profiles.reduce((sum, p) => sum + parseFloat(p.completion_percentage), 0) / profiles.length
      : 0;

    return {
      totalProfiles,
      totalViews,
      totalDownloads,
      averageCompletion: Math.round(avgCompletion),
      mostViewed: profiles.sort((a, b) => b.view_count - a.view_count)[0] || null,
      lastUpdated: profiles.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0] || null
    };
  }
}

module.exports = new ProfileService();
