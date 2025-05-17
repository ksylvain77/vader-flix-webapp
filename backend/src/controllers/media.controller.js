const mediaService = require("../services/media.service");

// Create and Save a new Media
exports.create = async (req, res) => {
  try {
    const data = await mediaService.create(req.body);
    res.status(201).send(data);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Retrieve all Media from the database
exports.findAll = async (req, res) => {
  try {
    const data = await mediaService.findAll(req.query.title);
    res.send(data);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Find a single Media with an id
exports.findOne = async (req, res) => {
  try {
    const data = await mediaService.findOne(req.params.id);
    res.send(data);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Update a Media by the id in the request
exports.update = async (req, res) => {
  try {
    const result = await mediaService.update(req.params.id, req.body);
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Delete a Media with the specified id in the request
exports.delete = async (req, res) => {
  try {
    const result = await mediaService.remove(req.params.id);
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};