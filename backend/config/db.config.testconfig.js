module.exports = {
    HOST: process.env.DB_HOST || "192.168.50.92",
    USER: process.env.DB_USER || "vaderflix",
    PASSWORD: process.env.DB_PASSWORD || "DarthVader2024",
    DB: process.env.DB_NAME || "vaderflix_test",
    PORT: process.env.DB_PORT || 3306,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }; 