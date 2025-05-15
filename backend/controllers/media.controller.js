const db = require("../models");
const Media = db.media;
const Op = db.Sequelize.Op;

// Create and Save a new Media
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title || !req.body.type) {
    res.status(400).send({
      message: "Title and type cannot be empty!"
    });
    return;
  }

  // Create a Media
  const media = {
    title: req.body.title,
    type: req.body.type,
    tmdbId: req.body.tmdbId,
    year: req.body.year,
    posterPath: req.body.posterPath,
    description: req.body.description,
    available: req.body.available || false,
    plexUrl: req.body.plexUrl
  };

  // Save Media in the database
  Media.create(media)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Media."
      });
    });
};

// Retrieve all Media from the database
exports.findAll = (req, res) => {
  const title = req.query.title;
  const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  Media.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving media."
      });
    });
};

// Find a single Media with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Media.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Media with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Media with id=" + id
      });
    });
};

// Update a Media by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Media.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Media was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Media with id=${id}. Maybe Media was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Media with id=" + id
      });
    });
};

// Delete a Media with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Media.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Media was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Media with id=${id}. Maybe Media was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Media with id=" + id
      });
    });
};