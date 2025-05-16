import { useEffect, useCallback } from 'react';
import websocketService from '../services/websocketService';

const useWebSocket = (messageHandlers = {}) => {
    useEffect(() => {
        // Connect to WebSocket when component mounts
        websocketService.connect();

        // Add message handlers
        Object.entries(messageHandlers).forEach(([type, handler]) => {
            websocketService.addMessageHandler(type, handler);
        });

        // Cleanup on unmount
        return () => {
            Object.entries(messageHandlers).forEach(([type, handler]) => {
                websocketService.removeMessageHandler(type, handler);
            });
            websocketService.disconnect();
        };
    }, [messageHandlers]);

    const sendMessage = useCallback((message) => {
        websocketService.send(message);
    }, []);

    return {
        sendMessage,
        isConnected: websocketService.ws?.readyState === WebSocket.OPEN
    };
};

export default useWebSocket; 