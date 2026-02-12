const { Language, Profile } = require('../models');
const { Op } = require('sequelize');

class LanguageService {
  async createLanguage(profileId, userId, languageData) {
    const profile = await Profile.findOne({
      where: { id: profileId, user_id: userId }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    const language = await Language.create({
      profile_id: profileId,
      ...languageData
    });

    return { language, message: 'Language created successfully' };
  }

  async getLanguagesByProfile(profileId, userId) {
    const profile = await Profile.findOne({
      where: { id: profileId, user_id: userId }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    const languages = await Language.findAll({
      where: { profile_id: profileId },
      order: [['display_order', 'ASC']]
    });

    return languages;
  }

  async getLanguageById(languageId, profileId, userId) {
    const profile = await Profile.findOne({
      where: { id: profileId, user_id: userId }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    const language = await Language.findOne({
      where: { id: languageId, profile_id: profileId }
    });

    if (!language) {
      throw new Error('Language not found');
    }

    return language;
  }

  async updateLanguage(languageId, profileId, userId, updates) {
    const language = await this.getLanguageById(languageId, profileId, userId);

    const allowedFields = [
      'name', 'proficiency_level', 'cefr_level',
      'can_read', 'can_write', 'can_speak', 'is_visible'
    ];

    const updateData = {};
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field];
      }
    });

    await language.update(updateData);

    return {
      language: await this.getLanguageById(languageId, profileId, userId),
      message: 'Language updated successfully'
    };
  }

  async deleteLanguage(languageId, profileId, userId) {
    const language = await this.getLanguageById(languageId, profileId, userId);
    await language.destroy();

    return { message: 'Language deleted successfully' };
  }

  async reorderLanguages(profileId, userId, orderedIds) {
    const profile = await Profile.findOne({
      where: { id: profileId, user_id: userId }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    const languages = await Language.findAll({
      where: {
        id: { [Op.in]: orderedIds },
        profile_id: profileId
      }
    });

    if (languages.length !== orderedIds.length) {
      throw new Error('Some language IDs are invalid');
    }

    await Language.reorder(profileId, orderedIds);

    return { message: 'Languages reordered successfully' };
  }

  async toggleVisibility(languageId, profileId, userId) {
    const language = await this.getLanguageById(languageId, profileId, userId);

    await language.update({ is_visible: !language.is_visible });

    return {
      language,
      message: `Language ${language.is_visible ? 'shown' : 'hidden'} successfully`
    };
  }

  async getLanguageStats(profileId, userId) {
    const profile = await Profile.findOne({
      where: { id: profileId, user_id: userId }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    const languages = await Language.findAll({
      where: { profile_id: profileId }
    });

    const total = languages.length;
    const visible = languages.filter(l => l.is_visible).length;

    const byProficiency = {};
    languages.forEach(language => {
      byProficiency[language.proficiency_level] = (byProficiency[language.proficiency_level] || 0) + 1;
    });

    const byCefrLevel = {};
    languages.forEach(language => {
      if (language.cefr_level) {
        byCefrLevel[language.cefr_level] = (byCefrLevel[language.cefr_level] || 0) + 1;
      }
    });

    return {
      total,
      visible,
      hidden: total - visible,
      byProficiency,
      byCefrLevel
    };
  }
}

module.exports = new LanguageService();
