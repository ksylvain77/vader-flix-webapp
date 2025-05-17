const radarrService = require('../services/radarr.service');

// Search for movies
exports.searchMovies = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }
        const results = await radarrService.searchMovies(query);
        res.json(results);
    } catch (error) {
        console.error('Error in searchMovies controller:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get all movies
exports.getAllMovies = async (req, res) => {
    try {
        const movies = await radarrService.getAllMovies();
        res.json(movies);
    } catch (error) {
        console.error('Error in getAllMovies controller:', error);
        res.status(500).json({ message: error.message });
    }
};

// Add a new movie
exports.addMovie = async (req, res) => {
    try {
        const { tmdbId } = req.body;
        if (!tmdbId) {
            return res.status(400).json({ message: 'TMDB ID is required' });
        }
        const result = await radarrService.addMovie(tmdbId);
        res.json(result);
    } catch (error) {
        console.error('Error in addMovie controller:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get download queue
exports.getQueue = async (req, res) => {
    try {
        const queue = await radarrService.getQueue();
        res.json(queue);
    } catch (error) {
        console.error('Error in getQueue controller:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get system status
exports.getStatus = async (req, res) => {
    try {
        const status = await radarrService.getStatus();
        res.json(status);
    } catch (error) {
        console.error('Error in getStatus controller:', error);
        res.status(500).json({ message: error.message });
    }
}; 