module.exports = {
    baseUrl: process.env.SONARR_BASE_URL || '',
    apiKey: process.env.SONARR_API_KEY || '',
    qualityProfileId: parseInt(process.env.SONARR_QUALITY_PROFILE_ID || '1', 10),
    rootFolderPath: process.env.SONARR_ROOT_FOLDER_PATH || '',
    seasonFolder: process.env.SONARR_SEASON_FOLDER === 'true',
    monitored: process.env.SONARR_MONITORED === 'true',
    searchForMissingEpisodes: process.env.SONARR_SEARCH_MISSING === 'true'
}; 