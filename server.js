const express = require('express');
const PlexAPI = require('plex-api');
const config = require('./config');

const app = express();
const port = process.env.PORT || 3000;

// Initialize Plex client
const plexClient = new PlexAPI({
    hostname: config.plex.baseUrl.replace(/^https?:\/\//, ''),
    token: config.plex.token
});

// GET /api/plex/library route
app.get('/api/plex/library', async (req, res) => {
    try {
        // Get the first library section (movies)
        const sectionId = config.plex.librarySectionIds[0];
        
        // Query the library section
        const result = await plexClient.query(`/library/sections/${sectionId}/all`);
        
        // Transform the response to include only required fields
        const movies = result.MediaContainer.Metadata.map(movie => ({
            title: movie.title,
            year: movie.year,
            summary: movie.summary,
            thumb: movie.thumb
        }));

        res.json(movies);
    } catch (error) {
        console.error('Error fetching Plex library:', error);
        res.status(500).json({ error: 'Failed to fetch Plex library' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 