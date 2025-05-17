const { Sequelize } = require('sequelize');
const dbConfig = require('./services/database');

const sequelize = new Sequelize(
    dbConfig.name,
    dbConfig.user,
    dbConfig.password,
    {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect,
        pool: dbConfig.pool,
        logging: process.env.NODE_ENV === 'development' ? console.log : false
    }
);

module.exports = sequelize; 