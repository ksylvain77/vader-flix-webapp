module.exports = {
    port: process.env.PORT || 3000,
    cors: {
        origin: process.env.CORS_ORIGIN || 'https://vaderflix.local',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    },
    logging: {
        level: 'info',
        format: 'combined'
    }
}; 