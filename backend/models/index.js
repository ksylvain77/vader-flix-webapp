const path = require('path');
let dbConfig;
if (process.env.NODE_ENV === 'test') {
  dbConfig = require(path.join(__dirname, '../config/db.config.test.js'));
} else {
  dbConfig = require('../config/db.config.js');
}
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  dbConfig.DB, 
  dbConfig.USER, 
  dbConfig.PASSWORD, 
  {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.users = require("./user.model.js")(sequelize, Sequelize);
db.media = require("./media.model.js")(sequelize, Sequelize);
db.requests = require("./request.model.js")(sequelize, Sequelize);

// Define relationships
db.users.hasMany(db.requests, { as: "requests" });
db.requests.belongsTo(db.users, {
  foreignKey: "userId",
  as: "user",
});

module.exports = db;