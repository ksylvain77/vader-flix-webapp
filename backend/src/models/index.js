const sequelize = require('../config/database');
const Sequelize = require('sequelize');

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