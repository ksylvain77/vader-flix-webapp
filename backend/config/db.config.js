module.exports = {
    HOST: process.env.DB_HOST || "mariadb",
    USER: process.env.DB_USER || "vaderflix",
    PASSWORD: process.env.DB_PASSWORD || "DarthVader2024",
    DB: process.env.DB_NAME || "vaderflix",
    PORT: process.env.DB_PORT || 3306,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };