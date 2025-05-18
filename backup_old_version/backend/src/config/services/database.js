module.exports = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: process.env.DB_DIALECT || 'mysql',
    pool: {
        max: parseInt(process.env.DB_POOL_MAX, 10) || 10,
        min: parseInt(process.env.DB_POOL_MIN, 10) || 0,
        acquire: parseInt(process.env.DB_POOL_ACQUIRE, 10) || 30000,
        idle: parseInt(process.env.DB_POOL_IDLE, 10) || 10000
    }
}; 