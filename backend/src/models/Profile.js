const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Profile = sequelize.define('Profile', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Nombre del perfil/CV (ej: "CV Desarrollador Senior")'
    },
    slug: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      comment: 'URL-friendly version of name'
    },
    template: {
      type: DataTypes.ENUM('harvard_classic', 'harvard_modern', 'oxford', 'ats'),
      allowNull: false,
      defaultValue: 'harvard_classic',
      comment: 'Template design chosen'
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Si es el CV por defecto del usuario'
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Si el CV es visible públicamente'
    },
    language: {
      type: DataTypes.ENUM('es', 'en'),
      allowNull: false,
      defaultValue: 'es',
      comment: 'Idioma del CV'
    },
    color_scheme: {
      type: DataTypes.STRING(50),
      defaultValue: 'harvard_crimson',
      comment: 'Esquema de colores aplicado'
    },
    completion_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00,
      comment: 'Porcentaje de completitud del CV (0-100)'
    },
    view_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Número de veces que se ha visto el CV'
    },
    download_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Número de descargas/exportaciones'
    },
    last_exported_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Última vez que se exportó a PDF'
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
    tableName: 'profiles',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: 'idx_profiles_user_id',
        fields: ['user_id']
      },
      {
        name: 'idx_profiles_slug',
        unique: true,
        fields: ['slug']
      },
      {
        name: 'idx_profiles_is_public',
        fields: ['is_public']
      }
    ]
  });

  /**
   * Generar slug único a partir del nombre
   */
  Profile.beforeValidate(async (profile) => {
    if (profile.name && !profile.slug) {
      const baseSlug = profile.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remover acentos
        .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
        .replace(/\s+/g, '-') // Espacios a guiones
        .replace(/-+/g, '-') // Múltiples guiones a uno
        .trim();

      let slug = baseSlug;
      let counter = 1;

      // Verificar unicidad y agregar número si es necesario
      while (await Profile.findOne({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      profile.slug = slug;
    }
  });

  /**
   * Verificar que solo haya un perfil por defecto por usuario
   */
  Profile.beforeSave(async (profile) => {
    if (profile.is_default && profile.changed('is_default')) {
      // Desmarcar otros perfiles del mismo usuario como default
      await Profile.update(
        { is_default: false },
        {
          where: {
            user_id: profile.user_id,
            id: { [sequelize.Sequelize.Op.ne]: profile.id }
          }
        }
      );
    }
  });

  /**
   * Método de instancia: Incrementar view count
   */
  Profile.prototype.incrementViewCount = async function() {
    this.view_count += 1;
    await this.save();
    return this;
  };

  /**
   * Método de instancia: Incrementar download count
   */
  Profile.prototype.incrementDownloadCount = async function() {
    this.download_count += 1;
    this.last_exported_at = new Date();
    await this.save();
    return this;
  };

  /**
   * Método de instancia: Marcar como perfil por defecto
   */
  Profile.prototype.setAsDefault = async function() {
    // Desmarcar otros perfiles del mismo usuario
    await Profile.update(
      { is_default: false },
      { where: { user_id: this.user_id } }
    );

    // Marcar este como default
    this.is_default = true;
    await this.save();
    return this;
  };

  /**
   * Método de instancia: Calcular porcentaje de completitud
   * Basado en las secciones completadas del CV
   */
  Profile.prototype.calculateCompletionPercentage = async function() {
    const weights = {
      personalInfo: 20,  // Información personal (obligatoria)
      education: 15,     // Al menos 1 educación
      experience: 20,    // Al menos 1 experiencia
      skills: 15,        // Al menos 3 skills
      languages: 10,     // Al menos 1 idioma
      certifications: 10, // Al menos 1 certificación
      socialNetworks: 10  // Al menos 2 redes sociales
    };

    let completionScore = 0;

    // Verificar Personal Info
    const personalInfo = await sequelize.models.PersonalInfo.findOne({
      where: { profile_id: this.id }
    });

    if (personalInfo) {
      // Verificar campos obligatorios de personalInfo
      const requiredFields = ['full_name', 'email', 'phone'];
      const filledRequiredFields = requiredFields.filter(field =>
        personalInfo[field] && personalInfo[field].trim() !== ''
      ).length;

      if (filledRequiredFields === requiredFields.length) {
        completionScore += weights.personalInfo;
      } else {
        // Puntaje parcial proporcional
        completionScore += (filledRequiredFields / requiredFields.length) * weights.personalInfo;
      }
    }

    // Verificar Education (al menos 1)
    const educationCount = await sequelize.models.Education.count({
      where: { profile_id: this.id }
    });
    if (educationCount >= 1) {
      completionScore += weights.education;
    }

    // Verificar Experience (al menos 1)
    const experienceCount = await sequelize.models.Experience.count({
      where: { profile_id: this.id }
    });
    if (experienceCount >= 1) {
      completionScore += weights.experience;
    }

    // Verificar Skills (al menos 3)
    const skillsCount = await sequelize.models.Skill.count({
      where: { profile_id: this.id }
    });
    if (skillsCount >= 3) {
      completionScore += weights.skills;
    } else if (skillsCount > 0) {
      // Puntaje parcial proporcional
      completionScore += (skillsCount / 3) * weights.skills;
    }

    // Verificar Languages (al menos 1)
    const languagesCount = await sequelize.models.Language.count({
      where: { profile_id: this.id }
    });
    if (languagesCount >= 1) {
      completionScore += weights.languages;
    }

    // Verificar Certifications (al menos 1)
    const certificationsCount = await sequelize.models.Certification.count({
      where: { profile_id: this.id }
    });
    if (certificationsCount >= 1) {
      completionScore += weights.certifications;
    }

    // Verificar Social Networks (al menos 2)
    const socialNetworksCount = await sequelize.models.SocialNetwork.count({
      where: { profile_id: this.id }
    });
    if (socialNetworksCount >= 2) {
      completionScore += weights.socialNetworks;
    } else if (socialNetworksCount === 1) {
      // Puntaje parcial
      completionScore += (1 / 2) * weights.socialNetworks;
    }

    // Actualizar el campo completion_percentage
    this.completion_percentage = parseFloat(completionScore.toFixed(2));
    await this.save();

    return this.completion_percentage;
  };

  /**
   * Método de instancia: Obtener secciones faltantes para completitud
   */
  Profile.prototype.getMissingSections = async function() {
    const missing = [];

    // Verificar Personal Info
    const personalInfo = await sequelize.models.PersonalInfo.findOne({
      where: { profile_id: this.id }
    });

    if (!personalInfo || !personalInfo.full_name || !personalInfo.email || !personalInfo.phone) {
      missing.push({
        section: 'personalInfo',
        message: 'Complete la información personal (nombre, email, teléfono)',
        weight: 20
      });
    }

    // Verificar Education
    const educationCount = await sequelize.models.Education.count({
      where: { profile_id: this.id }
    });
    if (educationCount === 0) {
      missing.push({
        section: 'education',
        message: 'Agregue al menos 1 entrada de educación',
        weight: 15
      });
    }

    // Verificar Experience
    const experienceCount = await sequelize.models.Experience.count({
      where: { profile_id: this.id }
    });
    if (experienceCount === 0) {
      missing.push({
        section: 'experience',
        message: 'Agregue al menos 1 experiencia laboral',
        weight: 20
      });
    }

    // Verificar Skills
    const skillsCount = await sequelize.models.Skill.count({
      where: { profile_id: this.id }
    });
    if (skillsCount < 3) {
      missing.push({
        section: 'skills',
        message: `Agregue ${3 - skillsCount} habilidad(es) más (mínimo 3)`,
        weight: 15
      });
    }

    // Verificar Languages
    const languagesCount = await sequelize.models.Language.count({
      where: { profile_id: this.id }
    });
    if (languagesCount === 0) {
      missing.push({
        section: 'languages',
        message: 'Agregue al menos 1 idioma',
        weight: 10
      });
    }

    // Verificar Certifications
    const certificationsCount = await sequelize.models.Certification.count({
      where: { profile_id: this.id }
    });
    if (certificationsCount === 0) {
      missing.push({
        section: 'certifications',
        message: 'Agregue al menos 1 certificación',
        weight: 10
      });
    }

    // Verificar Social Networks
    const socialNetworksCount = await sequelize.models.SocialNetwork.count({
      where: { profile_id: this.id }
    });
    if (socialNetworksCount < 2) {
      missing.push({
        section: 'socialNetworks',
        message: `Agregue ${2 - socialNetworksCount} red(es) social(es) más (mínimo 2)`,
        weight: 10
      });
    }

    return missing;
  };

  return Profile;
};
