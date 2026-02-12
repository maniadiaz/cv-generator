const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Skill = sequelize.define('Skill', {
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
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Nombre de la habilidad (ej: "JavaScript", "React")'
    },
    category: {
      type: DataTypes.ENUM(
        // Tecnología (5)
        'programming_languages',
        'frameworks_libraries',
        'databases',
        'cloud_devops',
        'mobile_development',
        // Diseño y Creatividad (3)
        'design_tools',
        'multimedia',
        'graphic_design',
        // Negocios (4)
        'project_management',
        'business_analysis',
        'marketing_digital',
        'sales',
        // Finanzas (2)
        'accounting',
        'finance',
        // Otros Sectores (16)
        'human_resources',
        'healthcare',
        'laboratory',
        'teaching',
        'legal',
        'operations',
        'logistics',
        'architecture',
        'engineering',
        'communication',
        'social_media',
        'customer_service',
        'office_tools',
        'soft_skills',
        'languages',
        'other'
      ),
      allowNull: false,
      defaultValue: 'other',
      comment: 'Categoría de la habilidad (33 categorías disponibles)'
    },
    proficiency_level: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced', 'expert'),
      allowNull: false,
      defaultValue: 'intermediate',
      comment: 'Nivel de dominio'
    },
    years_of_experience: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: true,
      comment: 'Años de experiencia (ej: 2.5)'
    },
    display_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Orden de visualización'
    },
    is_visible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Si debe mostrarse en el CV'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'skills',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: 'idx_skills_profile_id',
        fields: ['profile_id']
      },
      {
        name: 'idx_skills_category',
        fields: ['profile_id', 'category']
      },
      {
        name: 'idx_skills_display_order',
        fields: ['profile_id', 'display_order']
      }
    ]
  });

  /**
   * Hook: Asignar display_order automáticamente
   */
  Skill.beforeCreate(async (skill) => {
    if (skill.display_order === 0 || skill.display_order === null) {
      const maxOrder = await Skill.max('display_order', {
        where: { profile_id: skill.profile_id, category: skill.category }
      });
      skill.display_order = (maxOrder || 0) + 1;
    }
  });

  /**
   * Método estático: Reordenar skills de una categoría
   */
  Skill.reorder = async function(profileId, category, orderedIds) {
    const transaction = await sequelize.transaction();

    try {
      for (let i = 0; i < orderedIds.length; i++) {
        await Skill.update(
          { display_order: i },
          {
            where: {
              id: orderedIds[i],
              profile_id: profileId,
              category: category
            },
            transaction
          }
        );
      }

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  /**
   * Método estático: Obtener skills agrupados por categoría
   */
  Skill.getGroupedByCategory = async function(profileId) {
    const skills = await Skill.findAll({
      where: { profile_id: profileId },
      order: [['category', 'ASC'], ['display_order', 'ASC']]
    });

    const grouped = {};
    skills.forEach(skill => {
      if (!grouped[skill.category]) {
        grouped[skill.category] = [];
      }
      grouped[skill.category].push(skill);
    });

    return grouped;
  };

  return Skill;
};
