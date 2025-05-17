const cors = require('cors');
const express = require('express');

function setupMiddleware(app) {
    // CORS middleware
    app.use(cors({
        origin: ['http://localhost:3001', 'http://192.168.50.92:3001'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }));

    // JSON and URL-encoded body parsing
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Add any additional middleware here
    // Example: app.use(require('../middleware/auth'));
}

module.exports = setupMiddleware; 