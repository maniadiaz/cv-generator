const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PersonalInfo = sequelize.define('PersonalInfo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    profile_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'profiles',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      comment: 'Un perfil tiene solo una información personal'
    },
    full_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: 'Nombre completo del candidato'
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true
      },
      comment: 'Email profesional del candidato'
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Teléfono de contacto'
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Ciudad, País (ej: "Madrid, España")'
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: true
      },
      comment: 'Sitio web personal o portfolio'
    },
    linkedin: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'URL del perfil de LinkedIn'
    },
    github: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'URL del perfil de GitHub'
    },
    twitter: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'URL del perfil de Twitter/X'
    },
    professional_title: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Título profesional (ej: "Senior Full Stack Developer")'
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Resumen profesional o objetivo (2-4 párrafos)'
    },
    birth_date: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Fecha de nacimiento (opcional)'
    },
    nationality: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Nacionalidad del candidato'
    },
    marital_status: {
      type: DataTypes.ENUM('single', 'married', 'divorced', 'widowed', 'other'),
      allowNull: true,
      comment: 'Estado civil (opcional)'
    },
    driving_license: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Licencia de conducir (ej: "B, C")'
    },
    profile_photo_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'URL de la foto de perfil'
    },
    address_line1: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Dirección línea 1 (opcional)'
    },
    address_line2: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Dirección línea 2 (opcional)'
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Ciudad'
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Estado/Provincia'
    },
    postal_code: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Código postal'
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'País'
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
    tableName: 'personal_info',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: 'idx_personal_info_profile_id',
        unique: true,
        fields: ['profile_id']
      },
      {
        name: 'idx_personal_info_email',
        fields: ['email']
      }
    ]
  });

  /**
   * Método de instancia: Obtener información completa formateada
   */
  PersonalInfo.prototype.getFormattedInfo = function() {
    const info = {
      basic: {
        fullName: this.full_name,
        email: this.email,
        phone: this.phone,
        location: this.location,
        professionalTitle: this.professional_title
      },
      contact: {
        website: this.website,
        linkedin: this.linkedin,
        github: this.github,
        twitter: this.twitter
      },
      personal: {
        birthDate: this.birth_date,
        nationality: this.nationality,
        maritalStatus: this.marital_status,
        drivingLicense: this.driving_license
      },
      address: {
        line1: this.address_line1,
        line2: this.address_line2,
        city: this.city,
        state: this.state,
        postalCode: this.postal_code,
        country: this.country
      }
    };

    return info;
  };

  /**
   * Método de instancia: Verificar si la información está completa
   */
  PersonalInfo.prototype.isComplete = function() {
    const requiredFields = [
      this.full_name,
      this.email,
      this.phone,
      this.location,
      this.professional_title,
      this.summary
    ];

    return requiredFields.every(field => field && field.trim().length > 0);
  };

  /**
   * Método de instancia: Calcular completitud (porcentaje)
   */
  PersonalInfo.prototype.getCompletionPercentage = function() {
    const allFields = [
      this.full_name,
      this.email,
      this.phone,
      this.location,
      this.website,
      this.linkedin,
      this.github,
      this.professional_title,
      this.summary,
      this.profile_photo_url
    ];

    const filledFields = allFields.filter(field => field && field.trim().length > 0).length;
    return Math.round((filledFields / allFields.length) * 100);
  };

  return PersonalInfo;
};
