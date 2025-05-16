import React, { useState, useEffect } from 'react';
import PlexTokenService from '../services/plexTokenService';
import useWebSocket from '../hooks/useWebSocket';
import axios from 'axios';

const PlexTokenTest = () => {
    const [tokenStatus, setTokenStatus] = useState('idle');
    const [tokenInfo, setTokenInfo] = useState(null);
    const [error, setError] = useState(null);

    // WebSocket message handlers
    const messageHandlers = {
        tokenStatus: (message) => {
            setTokenStatus(message.status);
            if (message.info) {
                setTokenInfo(message.info);
            }
        },
        error: (message) => {
            setError(message.message);
        }
    };

    const { sendMessage, isConnected } = useWebSocket(messageHandlers);

    const testToken = async () => {
        setTokenStatus('testing');
        setError(null);
        
        try {
            // Get the token
            const token = PlexTokenService.getToken();
            
            // Test the token by making a request to Plex
            const response = await axios.get('https://plex.tv/api/v2/user', {
                headers: PlexTokenService.getHeaders()
            });

            // Send the result through WebSocket
            sendMessage({
                type: 'tokenTest',
                status: 'success',
                info: {
                    token: token,
                    user: response.data
                }
            });

        } catch (error) {
            setError(error.message);
            sendMessage({
                type: 'tokenTest',
                status: 'error',
                error: error.message
            });
        }
    };

    return (
        <div className="plex-token-test">
            <h2>Plex Token Test</h2>
            
            <div className="connection-status">
                WebSocket Status: {isConnected ? 'Connected' : 'Disconnected'}
            </div>

            <div className="token-section">
                <h3>Current Token</h3>
                <code>{PlexTokenService.getToken()}</code>
            </div>

            <div className="test-section">
                <button 
                    onClick={testToken}
                    disabled={tokenStatus === 'testing'}
                >
                    {tokenStatus === 'testing' ? 'Testing...' : 'Test Token'}
                </button>
            </div>

            {error && (
                <div className="error-message">
                    Error: {error}
                </div>
            )}

            {tokenInfo && (
                <div className="token-info">
                    <h3>Token Information</h3>
                    <pre>{JSON.stringify(tokenInfo, null, 2)}</pre>
                </div>
            )}

            <style jsx>{`
                .plex-token-test {
                    max-width: 800px;
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

                .token-section {
                    margin: 20px 0;
                    padding: 15px;
                    background-color: #f5f5f5;
                    border-radius: 4px;
                }

                code {
                    display: block;
                    padding: 10px;
                    background-color: #2d2d2d;
                    color: #fff;
                    border-radius: 4px;
                    overflow-x: auto;
                }

                .test-section {
                    margin: 20px 0;
                }

                button {
                    padding: 10px 20px;
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

                .error-message {
                    margin: 20px 0;
                    padding: 10px;
                    background-color: #ffe6e6;
                    border: 1px solid #ff9999;
                    border-radius: 4px;
                    color: #cc0000;
                }

                .token-info {
                    margin: 20px 0;
                    padding: 15px;
                    background-color: #f5f5f5;
                    border-radius: 4px;
                }

                pre {
                    background-color: #2d2d2d;
                    color: #fff;
                    padding: 15px;
                    border-radius: 4px;
                    overflow-x: auto;
                }
            `}</style>
        </div>
    );
};

export default PlexTokenTest; 