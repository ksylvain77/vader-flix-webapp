const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocketServer = require('./websocket');

// Create Express app
const app = express();

// Middleware
app.use(cors({
    origin: '*', // In production, replace with your frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Vader Flix API' });
});

// WebSocket status endpoint
app.get('/ws-status', (req, res) => {
    res.json({ 
        status: 'WebSocket server initialized',
        path: '/ws',
        serverTime: new Date().toISOString()
    });
});

// Routes
require('../routes/auth.routes')(app);
require('../routes/media.routes')(app);
require('../routes/request.routes')(app);

// Database initialization
try {
    const db = require("../models");
    db.sequelize.sync({ alter: true }).then(() => {
        console.log("Database synchronized");
    }).catch(err => {
        console.log("Failed to sync database: " + err.message);
    });
} catch (error) {
    console.log("Database connection skipped:", error.message);
}

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket server
const wss = new WebSocketServer(server);

// Set port and listen for requests
const PORT = process.env.PORT || 3000;

// Start server
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}.`);
    console.log(`WebSocket server available at: ws://0.0.0.0:${PORT}/ws`);
});

// Export for testing
module.exports = { app, server, wss }; 