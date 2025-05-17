const express = require('express');
const router = express.Router();
const radarrController = require('../controllers/radarr.controller');
const { verifyToken } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

// Search for movies
router.get('/search', radarrController.searchMovies);

// Get all movies
router.get('/movies', radarrController.getAllMovies);

// Add a new movie
router.post('/movies', radarrController.addMovie);

// Get download queue
router.get('/queue', radarrController.getQueue);

// Get system status
router.get('/status', radarrController.getStatus);

module.exports = router; 