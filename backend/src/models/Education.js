const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Education = sequelize.define('Education', {
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
      onUpdate: 'CASCADE',
      comment: 'Perfil al que pertenece esta educación'
    },
    institution: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: 'Nombre de la institución educativa'
    },
    degree: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: 'Título o grado obtenido (ej: "Licenciatura", "Maestría")'
    },
    field_of_study: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Área de estudio (ej: "Ingeniería en Sistemas")'
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: 'Fecha de inicio (solo año-mes-día)'
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Fecha de fin (null si está en curso)'
    },
    is_current: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Si está estudiando actualmente'
    },
    grade: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Calificación o promedio (ej: "9.5/10", "Cum Laude")'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Descripción de logros, actividades o proyectos'
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Ubicación de la institución'
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: true
      },
      comment: 'URL del sitio web de la institución'
    },
    display_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Orden de visualización (0 = primero)'
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
    tableName: 'education',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: 'idx_education_profile_id',
        fields: ['profile_id']
      },
      {
        name: 'idx_education_display_order',
        fields: ['profile_id', 'display_order']
      },
      {
        name: 'idx_education_dates',
        fields: ['start_date', 'end_date']
      }
    ]
  });

  /**
   * Hook: Actualizar is_current basado en end_date
   */
  Education.beforeSave(async (education) => {
    if (education.end_date === null) {
      education.is_current = true;
    } else if (education.end_date !== null && education.changed('end_date')) {
      education.is_current = false;
    }
  });

  /**
   * Hook: Asignar display_order automáticamente si no se proporciona
   */
  Education.beforeCreate(async (education) => {
    if (education.display_order === 0 || education.display_order === null) {
      const maxOrder = await Education.max('display_order', {
        where: { profile_id: education.profile_id }
      });
      education.display_order = (maxOrder || 0) + 1;
    }
  });

  /**
   * Método de instancia: Obtener duración en años y meses
   */
  Education.prototype.getDuration = function() {
    const start = new Date(this.start_date);
    const end = this.end_date ? new Date(this.end_date) : new Date();

    const diffTime = Math.abs(end - start);
    const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));

    const years = Math.floor(diffMonths / 12);
    const months = diffMonths % 12;

    return {
      years,
      months,
      totalMonths: diffMonths,
      formatted: years > 0
        ? `${years} ${years === 1 ? 'año' : 'años'}${months > 0 ? ` ${months} ${months === 1 ? 'mes' : 'meses'}` : ''}`
        : `${months} ${months === 1 ? 'mes' : 'meses'}`
    };
  };

  /**
   * Método de instancia: Validar fechas
   */
  Education.prototype.validateDates = function() {
    if (this.end_date && this.start_date) {
      const start = new Date(this.start_date);
      const end = new Date(this.end_date);

      if (end < start) {
        throw new Error('End date must be after start date');
      }

      // Validar que no sea en el futuro lejano (más de 1 año)
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

      if (end > oneYearFromNow) {
        throw new Error('End date cannot be more than 1 year in the future');
      }
    }

    return true;
  };

  /**
   * Método estático: Reordenar educaciones de un perfil
   */
  Education.reorder = async function(profileId, orderedIds) {
    const transaction = await sequelize.transaction();

    try {
      for (let i = 0; i < orderedIds.length; i++) {
        await Education.update(
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

  return Education;
};
