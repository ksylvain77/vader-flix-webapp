const WebSocket = require('ws');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.get('/', (req, res) => {
  res.send('WebSocket Test Server');
});

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Connected to test WebSocket server'
  }));
  
  ws.on('message', (message) => {
    console.log('Received:', message.toString());
    ws.send(JSON.stringify({
      type: 'echo',
      message: message.toString()
    }));
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

const PORT = 3030;
server.listen(PORT, () => {
  console.log(`Test WebSocket server running on port ${PORT}`);
}); 