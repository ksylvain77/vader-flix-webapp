const axios = require('axios');
const radarrConfig = require('../config/services/radarr');

class RadarrService {
    constructor() {
        this.client = axios.create({
            baseURL: radarrConfig.baseUrl,
            headers: {
                'X-Api-Key': radarrConfig.apiKey,
                'Content-Type': 'application/json'
            }
        });
    }

    // Search for movies
    async searchMovies(query) {
        try {
            const response = await this.client.get('/api/v3/movie/lookup', {
                params: { term: query }
            });
            return response.data;
        } catch (error) {
            console.error('Error searching Radarr:', error.message);
            throw new Error('Failed to search for movies');
        }
    }

    // Get all movies
    async getAllMovies() {
        try {
            const response = await this.client.get('/api/v3/movie');
            // Fix image URLs to be absolute
            const baseUrl = radarrConfig.baseUrl.replace(/\/$/, '');
            const processed = response.data.map(movie => ({
                ...movie,
                images: Array.isArray(movie.images)
                    ? movie.images.map(img => ({
                        ...img,
                        url: img.url && !img.url.startsWith('http')
                            ? `${baseUrl}${img.url}`
                            : img.url
                    }))
                    : []
            }));
            return processed;
        } catch (error) {
            console.error('Error fetching movies from Radarr:', error.message);
            throw new Error('Failed to fetch movies');
        }
    }

    // Add a new movie
    async addMovie(tmdbId) {
        try {
            // First get the movie details
            const lookupResponse = await this.client.get('/api/v3/movie/lookup', {
                params: { term: `tmdb:${tmdbId}` }
            });

            if (!lookupResponse.data || lookupResponse.data.length === 0) {
                throw new Error('Movie not found');
            }

            const movieData = lookupResponse.data[0];
            
            // Prepare the movie for addition
            const movieToAdd = {
                ...movieData,
                rootFolderPath: radarrConfig.rootFolderPath,
                qualityProfileId: radarrConfig.qualityProfileId,
                monitored: radarrConfig.monitored,
                addOptions: {
                    searchForMissingMovies: radarrConfig.searchForMissingMovies
                }
            };

            // Add the movie
            const response = await this.client.post('/api/v3/movie', movieToAdd);
            return response.data;
        } catch (error) {
            console.error('Error adding movie to Radarr:', error.message);
            throw new Error('Failed to add movie');
        }
    }

    // Get download queue
    async getQueue() {
        try {
            const response = await this.client.get('/api/v3/queue');
            return response.data;
        } catch (error) {
            console.error('Error fetching Radarr queue:', error.message);
            throw new Error('Failed to fetch download queue');
        }
    }

    // Get system status
    async getStatus() {
        try {
            const response = await this.client.get('/api/v3/system/status');
            return response.data;
        } catch (error) {
            console.error('Error fetching Radarr status:', error.message);
            throw new Error('Failed to fetch system status');
        }
    }
}

module.exports = new RadarrService(); 