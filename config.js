module.exports = {
    // Server config
    port: 3000,
    jwtSecret: 'vader-flix-secret-key-2025',

    // Service URLs
    sonarr: {
        baseUrl: 'http://192.168.50.92:8989',
        apiKey: '8709f14bd30d4924bc76349878a1a06f',
        qualityProfileId: 1,
        rootFolderPath: '/data/media/tv',
        seasonFolder: true,
        monitored: true,
        searchMissing: false
    },
    radarr: {
        baseUrl: 'http://192.168.50.92:7878',
        apiKey: '1796ecf4c4f244bfa6b7db47c6e271b0',
        qualityProfileId: 1,
        rootFolderPath: '/data/media/movies',
        monitored: true,
        searchMissing: false
    },
    plex: {
        baseUrl: 'http://192.168.50.92:32400',
        token: 'KghtDhw7utRNszSA8k5n',
        librarySectionIds: [1, 2, 3]
    }
}; 