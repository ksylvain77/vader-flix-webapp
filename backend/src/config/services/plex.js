module.exports = {
    baseUrl: process.env.PLEX_BASE_URL || 'http://192.168.50.92:32400',
    token: process.env.PLEX_TOKEN || '',
    librarySectionIds: (process.env.PLEX_LIBRARY_SECTION_IDS || '').split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id))
}; 