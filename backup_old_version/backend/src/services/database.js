const db = require('../models');

async function initializeDatabase() {
    try {
        await db.sequelize.sync({ alter: true });
        console.log("Database synchronized");
    } catch (err) {
        console.log("Failed to sync database: " + err.message);
    }
}

module.exports = { initializeDatabase }; 