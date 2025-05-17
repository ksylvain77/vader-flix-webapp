require('dotenv').config();
const sequelize = require('../config/database');

async function testNewConfig() {
    try {
        // Test the connection
        console.log('Testing database connection with new configuration...');
        await sequelize.authenticate();
        console.log('Database connection successful!');

        // Log the current database configuration
        console.log('\nCurrent database configuration:');
        console.log({
            host: sequelize.config.host,
            port: sequelize.config.port,
            database: sequelize.config.database,
            username: sequelize.config.username,
            dialect: sequelize.config.dialect,
            logging: sequelize.options.logging ? 'enabled' : 'disabled'
        });

    } catch (error) {
        console.error('Error:', error.message);
        console.error('\nFull error:', error);
    } finally {
        // Close the connection
        await sequelize.close();
    }
}

testNewConfig(); 