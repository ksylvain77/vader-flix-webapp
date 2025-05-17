const WebSocket = require('ws');

// Constants
const HEARTBEAT_INTERVAL = 30000;
const CLIENT_TIMEOUT = 35000;

class WebSocketServer {
    constructor(server) {
        this.wss = new WebSocket.Server({
            server: server,
            path: '/ws',
            perMessageDeflate: false,
            clientTracking: true
        });

        this.interval = null;
        this.setupWebSocket();
    }

    setupWebSocket() {
        this.wss.on('connection', this.handleConnection.bind(this));
        this.setupHeartbeat();
    }

    handleConnection(ws, req) {
        console.log('Client connected to WebSocket from:', req.socket.remoteAddress);
        
        // Set up heartbeat
        ws.isAlive = true;
        ws.on('pong', () => {
            ws.isAlive = true;
        });
        
        // Send welcome message
        this.sendMessage(ws, {
            type: 'connection',
            message: 'Connected to Vader Flix WebSocket server',
            time: new Date().toISOString()
        });
        
        // Set up message handler
        ws.on('message', (message) => this.handleMessage(ws, message));
        
        // Set up close handler
        ws.on('close', () => {
            console.log('Client disconnected from WebSocket');
        });

        // Set up error handler
        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    }

    handleMessage(ws, message) {
        console.log('Received message:', message.toString());
        
        try {
            const parsedMessage = JSON.parse(message.toString());
            
            // Handle heartbeat messages
            if (parsedMessage.type === 'ping') {
                this.sendMessage(ws, {
                    type: 'pong',
                    time: new Date().toISOString()
                });
                return;
            }
            
            // Echo the message back
            this.sendMessage(ws, {
                type: 'response',
                originalMessage: parsedMessage,
                time: new Date().toISOString()
            });
            
        } catch (error) {
            console.error('Error parsing message:', error);
            this.sendMessage(ws, {
                type: 'error',
                message: 'Invalid message format',
                time: new Date().toISOString()
            });
        }
    }

    sendMessage(ws, message) {
        ws.send(JSON.stringify(message));
    }

    setupHeartbeat() {
        this.interval = setInterval(() => {
            this.wss.clients.forEach((ws) => {
                if (ws.isAlive === false) {
                    console.log('Client timed out, terminating connection');
                    return ws.terminate();
                }
                
                ws.isAlive = false;
                ws.ping();
            });
        }, HEARTBEAT_INTERVAL);

        this.wss.on('close', () => {
            clearInterval(this.interval);
        });
    }

    // Public method to broadcast message to all clients
    broadcast(message) {
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                this.sendMessage(client, message);
            }
        });
    }
}

module.exports = WebSocketServer; 