const db = require("../models");
const Request = db.requests;
const User = db.users;
const Op = db.Sequelize.Op;

// Create and Save a new Request
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title || !req.body.type) {
    res.status(400).send({
      message: "Title and type cannot be empty!"
    });
    return;
  }

  // Create a Request
  const request = {
    title: req.body.title,
    type: req.body.type,
    tmdbId: req.body.tmdbId,
    notes: req.body.notes,
    userId: req.userId
  };

  // Save Request in the database
  Request.create(request)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Request."
      });
    });
};

// Retrieve all Requests from the database
exports.findAll = (req, res) => {
  const title = req.query.title;
  const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  Request.findAll({ 
    where: condition,
    include: [{
      model: User,
      as: "user",
      attributes: ['username', 'email']
    }]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving requests."
      });
    });
};

// Find all Requests for a user
exports.findAllForUser = (req, res) => {
  const userId = req.userId;

  Request.findAll({
    where: { userId: userId }
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving requests."
      });
    });
};

// Update a Request status
exports.updateStatus = (req, res) => {
  const id = req.params.id;
  
  // Validate request
  if (!req.body.status) {
    res.status(400).send({
      message: "Status cannot be empty!"
    });
    return;
  }

  Request.update(
    { status: req.body.status },
    { where: { id: id } }
  )
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Request status was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Request with id=${id}. Maybe Request was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Request with id=" + id
      });
    });
};