const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database
const db = require("./models");
db.sequelize.sync({ alter: true }).then(() => {
  console.log("Database synchronized");
}).catch(err => {
  console.log("Failed to sync database: " + err.message);
});

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
require('./routes/auth.routes')(app);
require('./routes/media.routes')(app);
require('./routes/request.routes')(app);

// Create HTTP server by wrapping Express app
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ 
  server: server,
  path: '/ws'
});

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  
  // Send a welcome message
  ws.send(JSON.stringify({ 
    type: 'connection', 
    message: 'Connected to Vader Flix WebSocket server',
    time: new Date().toISOString()
  }));
  
  // Handle incoming messages
  ws.on('message', (message) => {
    console.log('Received message:', message.toString());
    
    try {
      const parsedMessage = JSON.parse(message.toString());
      
      // Echo the message back
      ws.send(JSON.stringify({
        type: 'response',
        originalMessage: parsedMessage,
        time: new Date().toISOString()
      }));
      
    } catch (error) {
      console.error('Error parsing message:', error);
      ws.send(JSON.stringify({ 
        type: 'error', 
        message: 'Invalid message format',
        time: new Date().toISOString()
      }));
    }
  });
  
  // Handle disconnection
  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
  });
});

// Set port and listen for requests
const PORT = process.env.PORT || 3000;

// Use server.listen instead of app.listen
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  console.log(`WebSocket server available at: ws://localhost:${PORT}/ws`);
});