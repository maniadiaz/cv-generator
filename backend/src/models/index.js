const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool
  }
);

const db = {
  sequelize,
  Sequelize
};

// Importar modelos
db.User = require('./User')(sequelize);
db.Session = require('./Session')(sequelize);
db.Profile = require('./Profile')(sequelize);
db.PersonalInfo = require('./PersonalInfo')(sequelize);
db.Education = require('./Education')(sequelize);
db.Experience = require('./Experience')(sequelize);
db.Skill = require('./Skill')(sequelize);
db.Language = require('./Language')(sequelize);
db.Certification = require('./Certification')(sequelize);
db.SocialNetwork = require('./SocialNetwork')(sequelize);

// Configurar relaciones

// User <-> Session (1:N)
db.User.hasMany(db.Session, {
  foreignKey: 'user_id',
  as: 'sessions',
  onDelete: 'CASCADE'
});

db.Session.belongsTo(db.User, {
  foreignKey: 'user_id',
  as: 'user'
});

// User <-> Profile (1:N)
db.User.hasMany(db.Profile, {
  foreignKey: 'user_id',
  as: 'profiles',
  onDelete: 'CASCADE'
});

db.Profile.belongsTo(db.User, {
  foreignKey: 'user_id',
  as: 'user'
});

// Profile <-> PersonalInfo (1:1)
db.Profile.hasOne(db.PersonalInfo, {
  foreignKey: 'profile_id',
  as: 'personalInfo',
  onDelete: 'CASCADE'
});

db.PersonalInfo.belongsTo(db.Profile, {
  foreignKey: 'profile_id',
  as: 'profile'
});

// Profile <-> Education (1:N)
db.Profile.hasMany(db.Education, {
  foreignKey: 'profile_id',
  as: 'education',
  onDelete: 'CASCADE'
});

db.Education.belongsTo(db.Profile, {
  foreignKey: 'profile_id',
  as: 'profile'
});

// Profile <-> Experience (1:N)
db.Profile.hasMany(db.Experience, {
  foreignKey: 'profile_id',
  as: 'experience',
  onDelete: 'CASCADE'
});

db.Experience.belongsTo(db.Profile, {
  foreignKey: 'profile_id',
  as: 'profile'
});

// Profile <-> Skill (1:N)
db.Profile.hasMany(db.Skill, {
  foreignKey: 'profile_id',
  as: 'skills',
  onDelete: 'CASCADE'
});

db.Skill.belongsTo(db.Profile, {
  foreignKey: 'profile_id',
  as: 'profile'
});

// Profile <-> Language (1:N)
db.Profile.hasMany(db.Language, {
  foreignKey: 'profile_id',
  as: 'languages',
  onDelete: 'CASCADE'
});

db.Language.belongsTo(db.Profile, {
  foreignKey: 'profile_id',
  as: 'profile'
});

// Profile <-> Certification (1:N)
db.Profile.hasMany(db.Certification, {
  foreignKey: 'profile_id',
  as: 'certifications',
  onDelete: 'CASCADE'
});

db.Certification.belongsTo(db.Profile, {
  foreignKey: 'profile_id',
  as: 'profile'
});

// Profile <-> SocialNetwork (1:N)
db.Profile.hasMany(db.SocialNetwork, {
  foreignKey: 'profile_id',
  as: 'socialNetworks',
  onDelete: 'CASCADE'
});

db.SocialNetwork.belongsTo(db.Profile, {
  foreignKey: 'profile_id',
  as: 'profile'
});

// NO sincronizar automáticamente para evitar problemas con índices
// Usar migraciones en su lugar (npm run migrate)
// Solo validar conexión
if (process.env.NODE_ENV === 'development') {
  // sequelize.sync() está desactivado para evitar "Too many keys"
  // Usa migraciones: npm run migrate
  console.log('📊 Database models loaded (sync disabled, use migrations)');
}

module.exports = db;
