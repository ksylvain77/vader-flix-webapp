const path = require('path');
const fs = require('fs');
const schema = require('./schema');

// Determine the current environment
const env = process.env.NODE_ENV || 'development';

// Load environment-specific configuration
const envConfig = require(`./environments/${env}`);

// Load service configurations
const services = {
    database: require('./services/database'),
    auth: require('./services/auth'),
    plex: require('./services/plex'),
    docker: require('./services/docker')
};

// Merge all configurations
const config = {
    env,
    ...envConfig,
    services
};

// Validate the configuration
const validationResult = schema.validate(config);
if (validationResult.error) {
    throw new Error(`Configuration validation failed: ${validationResult.error.message}`);
}

module.exports = config; 