const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Experience = sequelize.define('Experience', {
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
      comment: 'Perfil al que pertenece esta experiencia'
    },
    project_title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: 'Título del proyecto o nombre del trabajo'
    },
    position: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: 'Cargo o posición desempeñada'
    },
    company: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Nombre de la empresa u organización'
    },
    company_website: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: true
      },
      comment: 'URL del sitio web de la empresa'
    },
    employment_type: {
      type: DataTypes.ENUM(
        'full_time',
        'part_time',
        'freelance',
        'contract',
        'internship',
        'volunteer',
        'self_employed'
      ),
      allowNull: true,
      comment: 'Tipo de empleo'
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Ubicación del trabajo'
    },
    location_type: {
      type: DataTypes.ENUM('onsite', 'remote', 'hybrid'),
      allowNull: true,
      defaultValue: 'onsite',
      comment: 'Tipo de ubicación del trabajo'
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: 'Fecha de inicio del proyecto/trabajo'
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Fecha de fin (null si está en curso)'
    },
    is_current: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Si está trabajando actualmente en esto'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Descripción del rol y responsabilidades'
    },
    achievements: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Logros y resultados específicos (puede ser JSON array)'
    },
    technologies: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Tecnologías utilizadas (JSON array de strings)'
    },
    project_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: true
      },
      comment: 'URL del proyecto o portfolio'
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
    tableName: 'experience',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: 'idx_experience_profile_id',
        fields: ['profile_id']
      },
      {
        name: 'idx_experience_display_order',
        fields: ['profile_id', 'display_order']
      },
      {
        name: 'idx_experience_dates',
        fields: ['start_date', 'end_date']
      },
      {
        name: 'idx_experience_company',
        fields: ['company']
      }
    ]
  });

  /**
   * Hook: Actualizar is_current basado en end_date
   */
  Experience.beforeSave(async (experience) => {
    if (experience.end_date === null) {
      experience.is_current = true;
    } else if (experience.end_date !== null && experience.changed('end_date')) {
      experience.is_current = false;
    }
  });

  /**
   * Hook: Asignar display_order automáticamente si no se proporciona
   */
  Experience.beforeCreate(async (experience) => {
    if (experience.display_order === 0 || experience.display_order === null) {
      const maxOrder = await Experience.max('display_order', {
        where: { profile_id: experience.profile_id }
      });
      experience.display_order = (maxOrder || 0) + 1;
    }
  });

  /**
   * Método de instancia: Obtener duración en años y meses
   */
  Experience.prototype.getDuration = function() {
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
   * Método de instancia: Parsear technologies de JSON
   */
  Experience.prototype.getTechnologies = function() {
    if (!this.technologies) return [];

    try {
      return typeof this.technologies === 'string'
        ? JSON.parse(this.technologies)
        : this.technologies;
    } catch (error) {
      return [];
    }
  };

  /**
   * Método de instancia: Parsear achievements de JSON
   */
  Experience.prototype.getAchievements = function() {
    if (!this.achievements) return [];

    try {
      return typeof this.achievements === 'string'
        ? JSON.parse(this.achievements)
        : this.achievements;
    } catch (error) {
      // Si no es JSON, dividir por líneas
      return this.achievements.split('\n').filter(line => line.trim());
    }
  };

  /**
   * Método de instancia: Validar fechas
   */
  Experience.prototype.validateDates = function() {
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
   * Método estático: Reordenar experiencias de un perfil
   */
  Experience.reorder = async function(profileId, orderedIds) {
    const transaction = await sequelize.transaction();

    try {
      for (let i = 0; i < orderedIds.length; i++) {
        await Experience.update(
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

  return Experience;
};
