const SonarrAPI = require('@jc21/sonarr-api');
const sonarrConfig = require('../config/services/sonarr');

// Validate required configuration
if (!sonarrConfig.apiKey) {
    throw new Error('Sonarr API key is required but not configured');
}

if (!sonarrConfig.baseUrl) {
    throw new Error('Sonarr base URL is required but not configured');
}

// Create and configure the Sonarr API client
const sonarrClient = new SonarrAPI({
    apiKey: sonarrConfig.apiKey,
    baseUrl: sonarrConfig.baseUrl,
    port: 443, // Default HTTPS port
    protocol: 'https'
});

// Export the configured client instance
module.exports = sonarrClient; 