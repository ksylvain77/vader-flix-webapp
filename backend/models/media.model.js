module.exports = (sequelize, Sequelize) => {
    const Media = sequelize.define("media", {
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
      year: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      posterPath: {
        type: Sequelize.STRING,
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      available: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      plexUrl: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });
  
    return Media;
  };