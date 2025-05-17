module.exports = {
    host: process.env.DB_HOST || 'mariadb',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    name: process.env.DB_NAME || 'vaderflix',
    user: process.env.DB_USER || 'vaderflix',
    password: process.env.DB_PASSWORD || 'DarthVader2024',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}; 