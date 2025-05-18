module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'DeathStarDesignFlaw',
    tokenExpiration: process.env.TOKEN_EXPIRATION || '1h',
    passwordPolicy: {
        minLength: 8,
        requireNumbers: true,
        requireSpecialChars: true
    }
}; 