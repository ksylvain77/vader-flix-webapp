module.exports = {
    baseUrl: process.env.RADARR_BASE_URL || '',
    apiKey: process.env.RADARR_API_KEY || '',
    qualityProfileId: parseInt(process.env.RADARR_QUALITY_PROFILE_ID || '1', 10),
    rootFolderPath: process.env.RADARR_ROOT_FOLDER_PATH || '',
    monitored: process.env.RADARR_MONITORED === 'true',
    searchForMissingMovies: process.env.RADARR_SEARCH_MISSING === 'true'
}; 