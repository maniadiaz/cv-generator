const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    // Credenciales
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Must be a valid email address'
        }
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },

    // Información personal
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    avatar_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },

    // Estado de la cuenta
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_premium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Usuario con suscripción premium'
    },

    // Tokens de seguridad
    verification_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Token para verificar email'
    },
    reset_password_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Token para recuperar contraseña'
    },
    reset_password_expires: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Expiración del token de recuperación'
    },

    // Seguridad y sesión
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    login_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Intentos fallidos de login'
    },
    locked_until: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Bloqueo temporal por intentos fallidos'
    },

    // Soft delete
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Fecha de eliminación lógica'
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: false, // No usar paranoid ya que tenemos deleted_at custom
    indexes: [
      { fields: ['email'] },
      { fields: ['verification_token'] },
      { fields: ['reset_password_token'] },
      { fields: ['deleted_at'] },
      { fields: ['is_premium'] }
    ]
  });

  // Métodos de instancia
  User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password_hash);
  };

  User.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.password_hash;
    delete values.verification_token;
    delete values.reset_password_token;
    delete values.reset_password_expires;
    return values;
  };

  User.prototype.isLocked = function() {
    return this.locked_until && this.locked_until > new Date();
  };

  User.prototype.incrementLoginAttempts = async function() {
    this.login_attempts += 1;

    // Bloquear después de 5 intentos fallidos por 15 minutos
    if (this.login_attempts >= 5) {
      this.locked_until = new Date(Date.now() + 15 * 60 * 1000);
    }

    await this.save();
  };

  User.prototype.resetLoginAttempts = async function() {
    this.login_attempts = 0;
    this.locked_until = null;
    this.last_login = new Date();
    await this.save();
  };

  // Hooks
  User.beforeCreate(async (user) => {
    if (user.password_hash && !user.password_hash.startsWith('$2')) {
      user.password_hash = await bcrypt.hash(user.password_hash, 10);
    }
  });

  User.beforeUpdate(async (user) => {
    if (user.changed('password_hash') && !user.password_hash.startsWith('$2')) {
      user.password_hash = await bcrypt.hash(user.password_hash, 10);
    }
  });

  return User;
};
