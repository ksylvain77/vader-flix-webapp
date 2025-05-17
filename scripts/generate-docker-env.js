#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Default values for development environment
const defaultEnv = {
    // Core Application
    NODE_ENV: 'development',
    PORT: '3000',
    
    // Database
    DB_HOST: 'mariadb',
    DB_PORT: '3306',
    DB_USER: 'vaderflix',
    DB_NAME: 'vaderflix',
    
    // Docker
    PUID: '1027',
    PGID: '65536',
    
    // CORS
    CORS_ORIGIN: 'http://localhost:3001'
};

// Function to generate Docker environment section
function generateDockerEnv(envVars) {
    return Object.entries(envVars)
        .map(([key, value]) => `      - ${key}=${value}`)
        .join('\n');
}

// Function to generate Docker Compose environment section
function generateDockerComposeEnv(envVars) {
    return `version: '3'
services:
  backend:
    environment:
${generateDockerEnv(envVars)}`;
}

// Main function
function main() {
    // Get environment from command line or use default
    const env = process.argv[2] || 'development';
    const outputFile = process.argv[3] || 'docker-compose.env.yaml';
    
    // Merge with default values
    const envVars = { ...defaultEnv };
    
    // Generate the Docker Compose environment section
    const dockerComposeEnv = generateDockerComposeEnv(envVars);
    
    // Write to file
    fs.writeFileSync(outputFile, dockerComposeEnv);
    console.log(`Generated Docker environment configuration in ${outputFile}`);
    console.log('\nPlease review the generated file and update any sensitive values before using.');
}

main(); 