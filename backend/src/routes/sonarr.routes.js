const express = require('express');
const router = express.Router();
const sonarrController = require('../controllers/sonarr.controller');
const { verifyToken } = require('../middleware/auth');
const axios = require('axios');
const sonarrConfig = require('../config/services/sonarr');

// All routes require authentication
router.use(verifyToken);

// Search for TV shows
router.get('/search', async (req, res) => {
    try {
        const { term } = req.query;
        if (!term) {
            return res.status(400).json({ error: 'Search term is required' });
        }

        const response = await axios.get(`${sonarrConfig.baseUrl}/api/series/lookup`, {
            params: { term },
            headers: {
                'X-Api-Key': sonarrConfig.apiKey
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error searching Sonarr:', error.message);
        res.status(500).json({ 
            error: 'Failed to search Sonarr',
            details: error.message
        });
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