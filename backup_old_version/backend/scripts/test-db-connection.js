require('dotenv').config();
const { Sequelize } = require('sequelize');

async function testConnection() {
    const sequelize = new Sequelize({
        host: '192.168.50.92',
        port: 3306,
        database: 'vaderflix',
        username: 'vaderflix',
        password: 'DarthVader2024',
        dialect: 'mysql'
    });

    try {
        // Test the connection
        console.log('Testing database connection...');
        await sequelize.authenticate();
        console.log('Database connection successful!');

        // Log the current database configuration
        console.log('\nCurrent database configuration:');
        console.log({
            host: sequelize.config.host,
            port: sequelize.config.port,
            database: sequelize.config.database,
            username: sequelize.config.username,
            dialect: sequelize.config.dialect
        });

    } catch (error) {
        console.error('Error:', error.message);
        console.error('\nFull error:', error);
    } finally {
        // Close the connection
        await sequelize.close();
    }
}

testConnection(); 