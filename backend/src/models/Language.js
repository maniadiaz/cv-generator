const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Language = sequelize.define('Language', {
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
      comment: 'Nombre del idioma (ej: "Español", "English")'
    },
    proficiency_level: {
      type: DataTypes.ENUM(
        'native',
        'fluent',
        'advanced',
        'intermediate',
        'basic'
      ),
      allowNull: false,
      comment: 'Nivel de dominio del idioma'
    },
    cefr_level: {
      type: DataTypes.ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2'),
      allowNull: true,
      comment: 'Nivel CEFR (Marco Común Europeo)'
    },
    can_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Puede leer en este idioma'
    },
    can_write: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Puede escribir en este idioma'
    },
    can_speak: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Puede hablar en este idioma'
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
    tableName: 'languages',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: 'idx_languages_profile_id',
        fields: ['profile_id']
      },
      {
        name: 'idx_languages_display_order',
        fields: ['profile_id', 'display_order']
      }
    ]
  });

  /**
   * Hook: Asignar display_order automáticamente
   */
  Language.beforeCreate(async (language) => {
    if (language.display_order === 0 || language.display_order === null) {
      const maxOrder = await Language.max('display_order', {
        where: { profile_id: language.profile_id }
      });
      language.display_order = (maxOrder || 0) + 1;
    }
  });

  /**
   * Método estático: Reordenar languages
   */
  Language.reorder = async function(profileId, orderedIds) {
    const transaction = await sequelize.transaction();

    try {
      for (let i = 0; i < orderedIds.length; i++) {
        await Language.update(
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
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  /**
   * Método de instancia: Obtener descripción del nivel
   */
  Language.prototype.getProficiencyDescription = function() {
    const descriptions = {
      native: 'Lengua materna',
      fluent: 'Fluido / Bilingüe',
      advanced: 'Avanzado',
      intermediate: 'Intermedio',
      basic: 'Básico'
    };

    return descriptions[this.proficiency_level] || this.proficiency_level;
  };

  return Language;
};
