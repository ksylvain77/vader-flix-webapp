const express = require('express');
const PlexAPI = require('plex-api');
const config = require('./config');

const app = express();
const port = process.env.PORT || 3000;

const plexClient = new PlexAPI({
  hostname: config.plex.hostname,
  token: config.plex.token
});

app.get('/api/plex/library', async (req, res) => {
  try {
    const sectionId = config.plex.librarySectionIds[0];
    const result = await plexClient.query(`/library/sections/${sectionId}/all`);

    const movies = (result.MediaContainer.Metadata || []).map(movie => ({
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
