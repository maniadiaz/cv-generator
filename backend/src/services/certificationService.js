const { Certification, Profile } = require('../models');
const { Op } = require('sequelize');

class CertificationService {
  async createCertification(profileId, userId, certificationData) {
    const profile = await Profile.findOne({
      where: { id: profileId, user_id: userId }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    const certification = await Certification.create({
      profile_id: profileId,
      ...certificationData
    });

    return { certification, message: 'Certification created successfully' };
  }

  async getCertificationsByProfile(profileId, userId) {
    const profile = await Profile.findOne({
      where: { id: profileId, user_id: userId }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    const certifications = await Certification.findAll({
      where: { profile_id: profileId },
      order: [['display_order', 'ASC']]
    });

    return certifications;
  }

  async getCertificationById(certificationId, profileId, userId) {
    const profile = await Profile.findOne({
      where: { id: profileId, user_id: userId }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    const certification = await Certification.findOne({
      where: { id: certificationId, profile_id: profileId }
    });

    if (!certification) {
      throw new Error('Certification not found');
    }

    return certification;
  }

  async updateCertification(certificationId, profileId, userId, updates) {
    const certification = await this.getCertificationById(certificationId, profileId, userId);

    const allowedFields = [
      'name', 'issuing_organization', 'issue_date',
      'expiration_date', 'does_not_expire', 'credential_id',
      'credential_url', 'description', 'is_visible'
    ];

    const updateData = {};
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field];
      }
    });

    await certification.update(updateData);

    return {
      certification: await this.getCertificationById(certificationId, profileId, userId),
      message: 'Certification updated successfully'
    };
  }

  async deleteCertification(certificationId, profileId, userId) {
    const certification = await this.getCertificationById(certificationId, profileId, userId);
    await certification.destroy();

    return { message: 'Certification deleted successfully' };
  }

  async reorderCertifications(profileId, userId, orderedIds) {
    const profile = await Profile.findOne({
      where: { id: profileId, user_id: userId }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    const certifications = await Certification.findAll({
      where: {
        id: { [Op.in]: orderedIds },
        profile_id: profileId
      }
    });

    if (certifications.length !== orderedIds.length) {
      throw new Error('Some certification IDs are invalid');
    }

    await Certification.reorder(profileId, orderedIds);

    return { message: 'Certifications reordered successfully' };
  }

  async toggleVisibility(certificationId, profileId, userId) {
    const certification = await this.getCertificationById(certificationId, profileId, userId);

    await certification.update({ is_visible: !certification.is_visible });

    return {
      certification,
      message: `Certification ${certification.is_visible ? 'shown' : 'hidden'} successfully`
    };
  }

  async getCertificationStats(profileId, userId) {
    const profile = await Profile.findOne({
      where: { id: profileId, user_id: userId }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    const certifications = await Certification.findAll({
      where: { profile_id: profileId }
    });

    const total = certifications.length;
    const visible = certifications.filter(c => c.is_visible).length;

    let expired = 0;
    let active = 0;

    certifications.forEach(certification => {
      if (certification.isExpired()) {
        expired++;
      } else {
        active++;
      }
    });

    const byOrganization = {};
    certifications.forEach(certification => {
      byOrganization[certification.issuing_organization] =
        (byOrganization[certification.issuing_organization] || 0) + 1;
    });

    return {
      total,
      visible,
      hidden: total - visible,
      expired,
      active,
      byOrganization
    };
  }
}

module.exports = new CertificationService();
