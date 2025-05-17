const requestService = require("../services/request.service");

// Create and Save a new Request
exports.create = async (req, res) => {
  try {
    const data = await requestService.create(req.body);
    res.send(data);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Retrieve all Requests from the database
exports.findAll = async (req, res) => {
  try {
    const data = await requestService.findAll(req.query.title);
    res.send(data);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Find all Requests for a user
exports.findAllForUser = async (req, res) => {
  try {
    const data = await requestService.findAllForUser(req.userId);
    res.send(data);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Update a Request status
exports.updateStatus = async (req, res) => {
  try {
    const result = await requestService.updateStatus(req.params.id, req.body.status);
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};