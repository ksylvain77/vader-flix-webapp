const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // In production, replace with your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database
try {
  const db = require("./models");
  db.sequelize.sync({ alter: true }).then(() => {
    console.log("Database synchronized");
  }).catch(err => {
    console.log("Failed to sync database: " + err.message);
  });
} catch (error) {
  console.log("Database connection skipped:", error.message);
}

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

// Create WebSocket server with CORS
const wss = new WebSocket.Server({ 
  server: server,
  path: '/ws',
  perMessageDeflate: false, // Disable compression for better performance
  clientTracking: true
});

// Heartbeat interval (30 seconds)
const HEARTBEAT_INTERVAL = 30000;
const CLIENT_TIMEOUT = 35000;

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  console.log('Client connected to WebSocket from:', req.socket.remoteAddress);
  
  // Set up heartbeat
  ws.isAlive = true;
  ws.on('pong', () => {
    ws.isAlive = true;
  });
  
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
      
      // Handle heartbeat messages
      if (parsedMessage.type === 'ping') {
        ws.send(JSON.stringify({
          type: 'pong',
          time: new Date().toISOString()
        }));
        return;
      }
      
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

  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Heartbeat interval
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      console.log('Client timed out, terminating connection');
      return ws.terminate();
    }
    
    ws.isAlive = false;
    ws.ping();
  });
}, HEARTBEAT_INTERVAL);

wss.on('close', () => {
  clearInterval(interval);
});

// Set port and listen for requests
const PORT = process.env.PORT || 3000;

// Use server.listen instead of app.listen
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}.`);
  console.log(`WebSocket server available at: ws://0.0.0.0:${PORT}/ws`);
});