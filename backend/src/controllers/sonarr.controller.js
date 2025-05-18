const sonarrService = require('../services/sonarr.service');

// Search for TV shows
exports.searchShows = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }
        const results = await sonarrService.searchShows(query);
        res.json(results);
    } catch (error) {
        console.error('Error in searchShows controller:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get all series
exports.getAllSeries = async (req, res) => {
    try {
        const series = await sonarrService.getAllSeries();
        res.json(series);
    } catch (error) {
        console.error('Error in getAllSeries controller:', error);
        res.status(500).json({ message: error.message });
    }
};

// Add a new series
exports.addSeries = async (req, res) => {
    try {
        const { tvdbId } = req.body;
        if (!tvdbId) {
            return res.status(400).json({ message: 'TVDB ID is required' });
        }
        const result = await sonarrService.addSeries(tvdbId);
        res.json(result);
    } catch (error) {
        console.error('Error in addSeries controller:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get download queue
exports.getQueue = async (req, res) => {
    try {
        const queue = await sonarrService.getQueue();
        res.json(queue);
    } catch (error) {
        console.error('Error in getQueue controller:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get system status
exports.getStatus = async (req, res) => {
    try {
        const status = await sonarrService.getStatus();
        res.json(status);
    } catch (error) {
        console.error('Error in getStatus controller:', error);
        res.status(500).json({ message: error.message });
    }
};

// Update series
exports.updateSeries = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        if (!id) {
            return res.status(400).json({ message: 'Series ID is required' });
        }
        
        const result = await sonarrService.updateSeries(id, updateData);
        res.json(result);
    } catch (error) {
        console.error('Error in updateSeries controller:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get a single series by ID
exports.getSeriesById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ message: 'Series ID is required' });
        }
        
        const series = await sonarrService.getSeriesById(id);
        res.json(series);
    } catch (error) {
        console.error('Error in getSeriesById controller:', error);
        res.status(500).json({ message: error.message });
    }
};

// Delete a series
exports.deleteSeries = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ message: 'Series ID is required' });
        }
        
        await sonarrService.deleteSeries(id);
        res.json({ message: 'Series deleted successfully' });
    } catch (error) {
        console.error('Error in deleteSeries controller:', error);
        res.status(500).json({ message: error.message });
    }
}; 