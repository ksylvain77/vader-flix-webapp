// Test component for PlexTokenService
import React from 'react';
import PlexTokenService from '../services/plexTokenService';
// This is a forced change to test git tracking

function TokenTest() {
    let token, headers;
    try {
        token = PlexTokenService.getToken();
        headers = PlexTokenService.getHeaders();
    } catch (error) {
        console.error('Error retrieving Plex token:', error);
        return (
            <div style={{ padding: '20px', color: 'red' }}>
                <h2>Error Retrieving Plex Token</h2>
                <p>{error.message}</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>Plex Token Service Test</h2>
            <div style={{ marginBottom: '20px' }}>
                <h3>Token:</h3>
                <pre style={{ 
                    backgroundColor: '#f5f5f5', 
                    padding: '10px', 
                    borderRadius: '5px',
                    overflow: 'auto'
                }}>
                    {token}
                </pre>
            </div>
            <div>
                <h3>Headers:</h3>
                <pre style={{ 
                    backgroundColor: '#f5f5f5', 
                    padding: '10px', 
                    borderRadius: '5px',
                    overflow: 'auto'
                }}>
                    {JSON.stringify(headers, null, 2)}
                </pre>
            </div>
        </div>
    );
}

export default TokenTest; 