const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Certification = sequelize.define('Certification', {
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
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: 'Nombre de la certificación'
    },
    issuing_organization: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: 'Organización emisora'
    },
    issue_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: 'Fecha de emisión'
    },
    expiration_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Fecha de expiración (null si no expira)'
    },
    does_not_expire: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Si la certificación no expira'
    },
    credential_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'ID de la credencial'
    },
    credential_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: true
      },
      comment: 'URL de verificación de la certificación'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Descripción de la certificación'
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
    tableName: 'certifications',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: 'idx_certifications_profile_id',
        fields: ['profile_id']
      },
      {
        name: 'idx_certifications_display_order',
        fields: ['profile_id', 'display_order']
      },
      {
        name: 'idx_certifications_dates',
        fields: ['issue_date', 'expiration_date']
      }
    ]
  });

  /**
   * Hook: Actualizar does_not_expire basado en expiration_date
   */
  Certification.beforeSave(async (certification) => {
    if (certification.expiration_date === null) {
      certification.does_not_expire = true;
    } else if (certification.expiration_date !== null && certification.changed('expiration_date')) {
      certification.does_not_expire = false;
    }
  });

  /**
   * Hook: Asignar display_order automáticamente
   */
  Certification.beforeCreate(async (certification) => {
    if (certification.display_order === 0 || certification.display_order === null) {
      const maxOrder = await Certification.max('display_order', {
        where: { profile_id: certification.profile_id }
      });
      certification.display_order = (maxOrder || 0) + 1;
    }
  });

  /**
   * Método de instancia: Verificar si está expirada
   */
  Certification.prototype.isExpired = function() {
    if (this.does_not_expire || !this.expiration_date) {
      return false;
    }

    const today = new Date();
    const expiration = new Date(this.expiration_date);

    return expiration < today;
  };

  /**
   * Método de instancia: Días hasta expiración
   */
  Certification.prototype.getDaysUntilExpiration = function() {
    if (this.does_not_expire || !this.expiration_date) {
      return null;
    }

    const today = new Date();
    const expiration = new Date(this.expiration_date);
    const diffTime = expiration - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  /**
   * Método de instancia: Validar fechas
   */
  Certification.prototype.validateDates = function() {
    if (this.expiration_date && this.issue_date) {
      const issue = new Date(this.issue_date);
      const expiration = new Date(this.expiration_date);

      if (expiration < issue) {
        throw new Error('Expiration date must be after issue date');
      }
    }

    return true;
  };

  /**
   * Método estático: Reordenar certifications
   */
  Certification.reorder = async function(profileId, orderedIds) {
    const transaction = await sequelize.transaction();

    try {
      for (let i = 0; i < orderedIds.length; i++) {
        await Certification.update(
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

  return Certification;
};
