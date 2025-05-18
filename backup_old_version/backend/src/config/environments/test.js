module.exports = {
    port: process.env.PORT || 3001, // Different port to avoid conflicts
    cors: {
        origin: 'http://localhost:3001',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    },
    logging: {
        level: 'error', // Only log errors during tests
        format: 'dev'
    }
}; 