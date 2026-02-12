const { SocialNetwork, Profile } = require('../models');
const { Op } = require('sequelize');

class SocialNetworkService {
  /**
   * Crear nueva red social
   */
  async createSocialNetwork(profileId, userId, socialNetworkData) {
    // Verificar que el perfil existe y pertenece al usuario
    const profile = await Profile.findOne({
      where: { id: profileId, user_id: userId }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    // Crear red social
    const socialNetwork = await SocialNetwork.create({
      profile_id: profileId,
      ...socialNetworkData
    });

    return {
      socialNetwork,
      message: 'Social network created successfully'
    };
  }

  /**
   * Obtener todas las redes sociales de un perfil
   */
  async getSocialNetworksByProfile(profileId, userId) {
    // Verificar ownership
    const profile = await Profile.findOne({
      where: { id: profileId, user_id: userId }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    const socialNetworks = await SocialNetwork.findAll({
      where: { profile_id: profileId },
      order: [['display_order', 'ASC']]
    });

    return socialNetworks;
  }

  /**
   * Obtener una red social por ID
   */
  async getSocialNetworkById(socialNetworkId, profileId, userId) {
    // Verificar ownership del perfil
    const profile = await Profile.findOne({
      where: { id: profileId, user_id: userId }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    const socialNetwork = await SocialNetwork.findOne({
      where: {
        id: socialNetworkId,
        profile_id: profileId
      }
    });

    if (!socialNetwork) {
      throw new Error('Social network not found');
    }

    return socialNetwork;
  }

  /**
   * Actualizar red social
   */
  async updateSocialNetwork(socialNetworkId, profileId, userId, updates) {
    const socialNetwork = await this.getSocialNetworkById(socialNetworkId, profileId, userId);

    // Campos permitidos para actualizar
    const allowedFields = [
      'platform',
      'url',
      'username',
      'is_visible'
    ];

    const updateData = {};
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field];
      }
    });

    await socialNetwork.update(updateData);

    return {
      socialNetwork: await this.getSocialNetworkById(socialNetworkId, profileId, userId),
      message: 'Social network updated successfully'
    };
  }

  /**
   * Eliminar red social
   */
  async deleteSocialNetwork(socialNetworkId, profileId, userId) {
    const socialNetwork = await this.getSocialNetworkById(socialNetworkId, profileId, userId);

    await socialNetwork.destroy();

    // Reordenar las redes sociales restantes
    const remainingSocialNetworks = await SocialNetwork.findAll({
      where: { profile_id: profileId },
      order: [['display_order', 'ASC']]
    });

    for (let i = 0; i < remainingSocialNetworks.length; i++) {
      await remainingSocialNetworks[i].update({ display_order: i });
    }

    return {
      message: 'Social network deleted successfully'
    };
  }

  /**
   * Reordenar redes sociales
   */
  async reorderSocialNetworks(profileId, userId, orderedIds) {
    // Verificar ownership
    const profile = await Profile.findOne({
      where: { id: profileId, user_id: userId }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    // Verificar que todos los IDs pertenecen al perfil
    const socialNetworks = await SocialNetwork.findAll({
      where: {
        id: { [Op.in]: orderedIds },
        profile_id: profileId
      }
    });

    if (socialNetworks.length !== orderedIds.length) {
      throw new Error('Some social network IDs are invalid or do not belong to this profile');
    }

    // Reordenar
    await SocialNetwork.reorder(profileId, orderedIds);

    return {
      message: 'Social networks reordered successfully'
    };
  }

  /**
   * Toggle visibility de red social
   */
  async toggleVisibility(socialNetworkId, profileId, userId) {
    const socialNetwork = await this.getSocialNetworkById(socialNetworkId, profileId, userId);

    await socialNetwork.update({
      is_visible: !socialNetwork.is_visible
    });

    return {
      socialNetwork,
      message: `Social network ${socialNetwork.is_visible ? 'shown' : 'hidden'} successfully`
    };
  }

  /**
   * Obtener estadísticas de redes sociales de un perfil
   */
  async getSocialNetworkStats(profileId, userId) {
    // Verificar ownership
    const profile = await Profile.findOne({
      where: { id: profileId, user_id: userId }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    const socialNetworks = await SocialNetwork.findAll({
      where: { profile_id: profileId }
    });

    const total = socialNetworks.length;
    const visible = socialNetworks.filter(sn => sn.is_visible).length;

    const byPlatform = {};
    socialNetworks.forEach(sn => {
      byPlatform[sn.platform] = (byPlatform[sn.platform] || 0) + 1;
    });

    return {
      total,
      visible,
      hidden: total - visible,
      byPlatform
    };
  }
}

module.exports = new SocialNetworkService();
