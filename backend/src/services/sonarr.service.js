const axios = require('axios');
const sonarrConfig = require('../config/services/sonarr');

class SonarrService {
    constructor() {
        this.client = axios.create({
            baseURL: sonarrConfig.baseUrl,
            headers: {
                'X-Api-Key': sonarrConfig.apiKey,
                'Content-Type': 'application/json'
            }
        });
    }

    // Search for TV shows
    async searchShows(query) {
        try {
            const response = await this.client.get('/api/v3/series/lookup', {
                params: { term: query }
            });
            return response.data;
        } catch (error) {
            console.error('Error searching Sonarr:', error.message);
            throw new Error('Failed to search for TV shows');
        }
    }

    // Get all series
    async getAllSeries() {
        try {
            const response = await this.client.get('/api/v3/series');
            // Fix image URLs to be absolute
            const baseUrl = sonarrConfig.baseUrl.replace(/\/$/, '');
            const processed = response.data.map(series => ({
                ...series,
                images: Array.isArray(series.images)
                    ? series.images.map(img => ({
                        ...img,
                        url: img.url && !img.url.startsWith('http')
                            ? `${baseUrl}${img.url}`
                            : img.url
                    }))
                    : []
            }));
            return processed;
        } catch (error) {
            console.error('Error fetching series from Sonarr:', error.message);
            throw new Error('Failed to fetch TV shows');
        }
    }

    // Add a new series
    async addSeries(tvdbId) {
        try {
            // First get the series details
            const lookupResponse = await this.client.get('/api/v3/series/lookup', {
                params: { term: `tvdb:${tvdbId}` }
            });

            if (!lookupResponse.data || lookupResponse.data.length === 0) {
                throw new Error('Series not found');
            }

            const seriesData = lookupResponse.data[0];
            
            // Prepare the series for addition
            const seriesToAdd = {
                ...seriesData,
                rootFolderPath: sonarrConfig.rootFolderPath,
                qualityProfileId: sonarrConfig.qualityProfileId,
                seasonFolder: sonarrConfig.seasonFolder,
                monitored: sonarrConfig.monitored,
                addOptions: {
                    searchForMissingEpisodes: sonarrConfig.searchForMissingEpisodes
                }
            };

            // Add the series
            const response = await this.client.post('/api/v3/series', seriesToAdd);
            return response.data;
        } catch (error) {
            console.error('Error adding series to Sonarr:', error.message);
            throw new Error('Failed to add TV show');
        }
    }

    // Get download queue
    async getQueue() {
        try {
            const response = await this.client.get('/api/v3/queue');
            return response.data;
        } catch (error) {
            console.error('Error fetching Sonarr queue:', error.message);
            throw new Error('Failed to fetch download queue');
        }
    }

    // Get system status
    async getStatus() {
        try {
            const response = await this.client.get('/api/v3/system/status');
            return response.data;
        } catch (error) {
            console.error('Error fetching Sonarr status:', error.message);
            throw new Error('Failed to fetch system status');
        }
    }

    // Get a single series by ID
    async getSeriesById(id) {
        try {
            const response = await this.client.get(`/api/v3/series/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching series from Sonarr:', error.message);
            throw new Error('Failed to fetch series');
        }
    }

    // Delete a series
    async deleteSeries(id) {
        try {
            await this.client.delete(`/api/v3/series/${id}`, {
                params: {
                    deleteFiles: true,
                    addImportListExclusion: true
                }
            });
        } catch (error) {
            console.error('Error deleting series from Sonarr:', error.message);
            throw new Error('Failed to delete series');
        }
    }

    // Update series monitoring status
    async updateSeries(seriesId, updateData) {
        try {
            const response = await this.client.put(`/api/v3/series/${seriesId}`, updateData);
            return response.data;
        } catch (error) {
            console.error('Error updating series in Sonarr:', error.message);
            throw new Error('Failed to update TV show');
        }
    }

    // Trigger Sonarr command
    async triggerCommand(name, seriesId) {
        try {
            const commandData = {
                name,
                ...(seriesId && { seriesId: parseInt(seriesId, 10) })
            };

            const response = await this.client.post('/api/v3/command', commandData);
            return response.data;
        } catch (error) {
            console.error('Error triggering Sonarr command:', error.message);
            throw new Error('Failed to trigger command');
        }
    }
}

module.exports = new SonarrService(); 