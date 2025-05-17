const express = require('express');
const router = express.Router();
const sonarrController = require('../controllers/sonarr.controller');
const { verifyToken } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

// Search for TV shows
router.get('/search', async (req, res) => {
    try {
        const { term } = req.query;
        console.log('Received search request for term:', term);
        res.json({ received: true });
    } catch (error) {
        console.error('Error in search route:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all series
router.get('/series', sonarrController.getAllSeries);

// Add a new series
router.post('/series', sonarrController.addSeries);

// Get download queue
router.get('/queue', sonarrController.getQueue);

// Get system status
router.get('/status', sonarrController.getStatus);

module.exports = router; 