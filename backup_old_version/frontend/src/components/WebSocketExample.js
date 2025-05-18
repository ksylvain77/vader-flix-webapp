import React, { useState } from 'react';
import useWebSocket from '../hooks/useWebSocket';

const WebSocketExample = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    // Define message handlers
    const messageHandlers = {
        connection: (message) => {
            setMessages(prev => [...prev, { type: 'system', content: message.message }]);
        },
        response: (message) => {
            setMessages(prev => [...prev, { 
                type: 'response', 
                content: `Received: ${JSON.stringify(message.originalMessage)}`,
                timestamp: message.timestamp 
            }]);
        },
        error: (message) => {
            setMessages(prev => [...prev, { type: 'error', content: message.message }]);
        }
    };

    // Use the WebSocket hook
    const { sendMessage, isConnected } = useWebSocket(messageHandlers);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            sendMessage({
                type: 'message',
                content: inputMessage
            });
            setInputMessage('');
        }
    };

    return (
        <div className="websocket-example">
            <div className="connection-status">
                Status: {isConnected ? 'Connected' : 'Disconnected'}
            </div>

            <div className="messages-container">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.type}`}>
                        {msg.content}
                        {msg.timestamp && (
                            <span className="timestamp">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            <form onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type a message..."
                    disabled={!isConnected}
                />
                <button type="submit" disabled={!isConnected}>
                    Send
                </button>
            </form>

            <style jsx>{`
                .websocket-example {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                }

                .connection-status {
                    margin-bottom: 20px;
                    padding: 10px;
                    background-color: ${isConnected ? '#e6ffe6' : '#ffe6e6'};
                    border-radius: 4px;
                }

                .messages-container {
                    height: 300px;
                    overflow-y: auto;
                    margin-bottom: 20px;
                    padding: 10px;
                    border: 1px solid #eee;
                    border-radius: 4px;
                }

                .message {
                    margin: 5px 0;
                    padding: 8px;
                    border-radius: 4px;
                }

                .message.system {
                    background-color: #f0f0f0;
                }

                .message.response {
                    background-color: #e6f3ff;
                }

                .message.error {
                    background-color: #ffe6e6;
                }

                .timestamp {
                    font-size: 0.8em;
                    color: #666;
                    margin-left: 10px;
                }

                form {
                    display: flex;
                    gap: 10px;
                }

                input {
                    flex: 1;
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }

                button {
                    padding: 8px 16px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }

                button:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default WebSocketExample; 