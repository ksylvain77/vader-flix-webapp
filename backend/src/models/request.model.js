module.exports = (sequelize, Sequelize) => {
    const Request = sequelize.define("request", {
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('movie', 'tv'),
        allowNull: false
      },
      tmdbId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected', 'completed'),
        defaultValue: 'pending'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      }
    });
  
    return Request;
  };