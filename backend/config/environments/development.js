module.exports = {
    port: process.env.PORT || 3000,
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    },
    logging: {
        level: 'debug',
        format: 'dev'
    }
}; 