class WebSocketService {
    constructor() {
        this.ws = null;
        this.messageHandlers = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000; // 3 seconds
        this.heartbeatInterval = null;
        this.heartbeatTimeout = null;
        this.connectionCount = 0; // Track number of components using the connection
    }

    connect() {
        this.connectionCount++;
        
        // If already connected, just increment the counter
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            return;
        }

        // If there's an existing connection attempt, don't create a new one
        if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
            return;
        }

        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsHost = window.location.hostname + ':3000';
        const wsUrl = `${wsProtocol}//${wsHost}/ws`;

        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log('WebSocket connected');
            this.reconnectAttempts = 0;
            this.startHeartbeat();
        };

        this.ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                
                // Handle heartbeat pong
                if (message.type === 'pong') {
                    this.handlePong();
                    return;
                }

                const handlers = this.messageHandlers.get(message.type) || [];
                handlers.forEach(handler => handler(message));
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        this.ws.onclose = () => {
            console.log('WebSocket disconnected');
            this.stopHeartbeat();
            if (this.connectionCount > 0) {
                this.attemptReconnect();
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.stopHeartbeat();
        };
    }

    startHeartbeat() {
        this.stopHeartbeat(); // Clear any existing heartbeat

        // Send ping every 25 seconds
        this.heartbeatInterval = setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.send({ type: 'ping' });
            }
        }, 25000);

        // Set timeout for pong response
        this.heartbeatTimeout = setTimeout(() => {
            console.log('Heartbeat timeout - reconnecting...');
            if (this.ws) {
                this.ws.close();
            }
        }, 30000);
    }

    handlePong() {
        // Clear the timeout since we got a pong
        if (this.heartbeatTimeout) {
            clearTimeout(this.heartbeatTimeout);
        }
        // Set new timeout
        this.heartbeatTimeout = setTimeout(() => {
            console.log('Heartbeat timeout - reconnecting...');
            if (this.ws) {
                this.ws.close();
            }
        }, 30000);
    }

    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
        if (this.heartbeatTimeout) {
            clearTimeout(this.heartbeatTimeout);
            this.heartbeatTimeout = null;
        }
    }

    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
            setTimeout(() => this.connect(), this.reconnectDelay);
        } else {
            console.error('Max reconnection attempts reached');
        }
    }

    disconnect() {
        this.connectionCount--;
        
        // Only actually disconnect if no components are using the connection
        if (this.connectionCount <= 0) {
            this.connectionCount = 0;
            this.stopHeartbeat();
            if (this.ws) {
                this.ws.close();
                this.ws = null;
            }
        }
    }

    send(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not connected');
        }
    }

    addMessageHandler(type, handler) {
        if (!this.messageHandlers.has(type)) {
            this.messageHandlers.set(type, []);
        }
        this.messageHandlers.get(type).push(handler);
    }

    removeMessageHandler(type, handler) {
        if (this.messageHandlers.has(type)) {
            const handlers = this.messageHandlers.get(type);
            const index = handlers.indexOf(handler);
            if (index !== -1) {
                handlers.splice(index, 1);
            }
        }
    }
}

// Create a singleton instance
const websocketService = new WebSocketService();
export default websocketService; 