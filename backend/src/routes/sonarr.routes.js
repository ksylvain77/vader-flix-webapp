const express = require('express');
const router = express.Router();
const sonarrController = require('../controllers/sonarr.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(verifyToken);

// Search for TV shows
router.get('/search', sonarrController.searchShows);

// Get all series
router.get('/series', sonarrController.getAllSeries);

// Add a new series
router.post('/series', sonarrController.addSeries);

// Get download queue
router.get('/queue', sonarrController.getQueue);

// Get system status
router.get('/status', sonarrController.getStatus);

module.exports = router; 