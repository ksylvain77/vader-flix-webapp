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
        const { query } = req.query;
        const trimmedQuery = query?.trim();

        if (!trimmedQuery || trimmedQuery.length < 2) {
            return res.status(400).json({ 
                error: 'Search query must be at least 2 characters long',
                received: false
            });
        }

        console.log('Making Sonarr API call for query:', trimmedQuery);
        
        const response = await axios.get(`${sonarrConfig.baseUrl}/api/v3/series/lookup`, {
            params: { term: trimmedQuery },
            headers: {
                'X-Api-Key': sonarrConfig.apiKey
            }
        });

        console.log('Sonarr API response received');
        res.json(response.data);
    } catch (error) {
        console.error('Error searching Sonarr:', error.message);
        if (error.response) {
            console.error('Sonarr API error response:', error.response.data);
        }
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