const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SocialNetwork = sequelize.define('SocialNetwork', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    profile_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'profiles',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    platform: {
      type: DataTypes.ENUM(
        'linkedin',
        'github',
        'gitlab',
        'twitter',
        'portfolio',
        'stackoverflow',
        'medium',
        'youtube',
        'behance',
        'dribbble',
        'other'
      ),
      allowNull: false,
      comment: 'Social media platform or website type'
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        isUrl: {
          msg: 'Must be a valid URL'
        }
      },
      comment: 'Full URL to the social media profile or website'
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Username or handle (optional)'
    },
    display_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Order in which to display this social network'
    },
    is_visible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether to show this social network in the CV'
    }
  }, {
    tableName: 'social_networks',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['profile_id']
      },
      {
        fields: ['profile_id', 'display_order']
      }
    ]
  });

  // Auto-assign display_order before creating
  SocialNetwork.beforeCreate(async (socialNetwork) => {
    if (socialNetwork.display_order === 0 || socialNetwork.display_order === null) {
      const maxOrder = await SocialNetwork.max('display_order', {
        where: { profile_id: socialNetwork.profile_id }
      });
      socialNetwork.display_order = (maxOrder || 0) + 1;
    }
  });

  // Reorder remaining items after deletion
  SocialNetwork.afterDestroy(async (socialNetwork) => {
    const remaining = await SocialNetwork.findAll({
      where: {
        profile_id: socialNetwork.profile_id,
        display_order: { [sequelize.Sequelize.Op.gt]: socialNetwork.display_order }
      },
      order: [['display_order', 'ASC']]
    });

    for (const item of remaining) {
      await item.update({ display_order: item.display_order - 1 });
    }
  });

  // Static method to reorder social networks
  SocialNetwork.reorder = async function(profileId, orderedIds) {
    const transaction = await sequelize.transaction();
    try {
      for (let i = 0; i < orderedIds.length; i++) {
        await SocialNetwork.update(
          { display_order: i },
          {
            where: {
              id: orderedIds[i],
              profile_id: profileId
            },
            transaction
          }
        );
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  // Instance method to get platform display name
  SocialNetwork.prototype.getPlatformDisplayName = function() {
    const platformNames = {
      linkedin: 'LinkedIn',
      github: 'GitHub',
      gitlab: 'GitLab',
      twitter: 'Twitter',
      portfolio: 'Portfolio',
      stackoverflow: 'Stack Overflow',
      medium: 'Medium',
      youtube: 'YouTube',
      behance: 'Behance',
      dribbble: 'Dribbble',
      other: 'Other'
    };
    return platformNames[this.platform] || this.platform;
  };

  // Instance method to get platform icon/color (for frontend use)
  SocialNetwork.prototype.getPlatformMetadata = function() {
    const metadata = {
      linkedin: { color: '#0077B5', icon: 'linkedin' },
      github: { color: '#181717', icon: 'github' },
      gitlab: { color: '#FC6D26', icon: 'gitlab' },
      twitter: { color: '#1DA1F2', icon: 'twitter' },
      portfolio: { color: '#000000', icon: 'web' },
      stackoverflow: { color: '#F58025', icon: 'stackoverflow' },
      medium: { color: '#000000', icon: 'medium' },
      youtube: { color: '#FF0000', icon: 'youtube' },
      behance: { color: '#1769FF', icon: 'behance' },
      dribbble: { color: '#EA4C89', icon: 'dribbble' },
      other: { color: '#6C757D', icon: 'link' }
    };
    return metadata[this.platform] || metadata.other;
  };

  return SocialNetwork;
};
