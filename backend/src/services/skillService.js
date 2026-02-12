const { Skill, Profile } = require('../models');
const { Op } = require('sequelize');

class SkillService {
  async createSkill(profileId, userId, skillData) {
    const profile = await Profile.findOne({
      where: { id: profileId, user_id: userId }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    const skill = await Skill.create({
      profile_id: profileId,
      ...skillData
    });

    return { skill, message: 'Skill created successfully' };
  }

  async getSkillsByProfile(profileId, userId, groupByCategory = false) {
    const profile = await Profile.findOne({
      where: { id: profileId, user_id: userId }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    if (groupByCategory) {
      return await Skill.getGroupedByCategory(profileId);
    }

    const skills = await Skill.findAll({
      where: { profile_id: profileId },
      order: [['category', 'ASC'], ['display_order', 'ASC']]
    });

    return skills;
  }

  async getSkillById(skillId, profileId, userId) {
    const profile = await Profile.findOne({
      where: { id: profileId, user_id: userId }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    const skill = await Skill.findOne({
      where: { id: skillId, profile_id: profileId }
    });

    if (!skill) {
      throw new Error('Skill not found');
    }

    return skill;
  }

  async updateSkill(skillId, profileId, userId, updates) {
    const skill = await this.getSkillById(skillId, profileId, userId);

    const allowedFields = [
      'name', 'category', 'proficiency_level',
      'years_of_experience', 'is_visible'
    ];

    const updateData = {};
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field];
      }
    });

    await skill.update(updateData);

    return {
      skill: await this.getSkillById(skillId, profileId, userId),
      message: 'Skill updated successfully'
    };
  }

  async deleteSkill(skillId, profileId, userId) {
    const skill = await this.getSkillById(skillId, profileId, userId);
    await skill.destroy();

    return { message: 'Skill deleted successfully' };
  }

  async reorderSkills(profileId, userId, category, orderedIds) {
    const profile = await Profile.findOne({
      where: { id: profileId, user_id: userId }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    const skills = await Skill.findAll({
      where: {
        id: { [Op.in]: orderedIds },
        profile_id: profileId,
        category: category
      }
    });

    if (skills.length !== orderedIds.length) {
      throw new Error('Some skill IDs are invalid');
    }

    await Skill.reorder(profileId, category, orderedIds);

    return { message: 'Skills reordered successfully' };
  }

  async toggleVisibility(skillId, profileId, userId) {
    const skill = await this.getSkillById(skillId, profileId, userId);

    await skill.update({ is_visible: !skill.is_visible });

    return {
      skill,
      message: `Skill ${skill.is_visible ? 'shown' : 'hidden'} successfully`
    };
  }

  async getSkillStats(profileId, userId) {
    const profile = await Profile.findOne({
      where: { id: profileId, user_id: userId }
    });

    if (!profile) {
      throw new Error('Profile not found or access denied');
    }

    const skills = await Skill.findAll({
      where: { profile_id: profileId }
    });

    const total = skills.length;
    const visible = skills.filter(s => s.is_visible).length;

    const byCategory = {};
    skills.forEach(skill => {
      byCategory[skill.category] = (byCategory[skill.category] || 0) + 1;
    });

    const byProficiency = {};
    skills.forEach(skill => {
      byProficiency[skill.proficiency_level] = (byProficiency[skill.proficiency_level] || 0) + 1;
    });

    return {
      total,
      visible,
      hidden: total - visible,
      byCategory,
      byProficiency
    };
  }
}

module.exports = new SkillService();
