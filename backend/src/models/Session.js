const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Session = sequelize.define('Session', {
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
      }
    },

    // Tokens JWT
    token: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true,
      comment: 'Access token'
    },
    refresh_token: {
      type: DataTypes.STRING(500),
      allowNull: true,
      unique: true,
      comment: 'Refresh token'
    },

    // Información del dispositivo
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    user_agent: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    device_type: {
      type: DataTypes.ENUM('desktop', 'mobile', 'tablet'),
      defaultValue: 'desktop'
    },
    device_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Nombre identificativo del dispositivo'
    },

    // Control de sesión
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Expiración del access token'
    },
    refresh_expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Expiración del refresh token'
    },

    // Última actividad
    last_activity: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: 'Última actividad del usuario'
    }
  }, {
    tableName: 'sessions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['user_id'] },
      { fields: ['token'] },
      { fields: ['refresh_token'] },
      { fields: ['is_active'] },
      { fields: ['expires_at'] }
    ]
  });

  // Métodos de instancia
  Session.prototype.isExpired = function() {
    return this.expires_at < new Date();
  };

  Session.prototype.isRefreshExpired = function() {
    return this.refresh_expires_at && this.refresh_expires_at < new Date();
  };

  Session.prototype.updateActivity = async function() {
    this.last_activity = new Date();
    await this.save();
  };

  Session.prototype.revoke = async function() {
    this.is_active = false;
    await this.save();
  };

  return Session;
};
