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
            <div style={{ 
                padding: '20px', 
                color: 'red',
                backgroundColor: '#fff3f3',
                borderRadius: '5px',
                border: '1px solid #ffcdd2'
            }}>
                <h2>Error Retrieving Plex Token</h2>
                <p>{error.message}</p>
            </div>
        );
    }

    return (
        <div style={{ 
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #dee2e6'
        }}>
            <h2 style={{ 
                color: '#333',
                marginBottom: '20px',
                paddingBottom: '10px',
                borderBottom: '2px solid #007bff'
            }}>
                Plex Token Service Test
            </h2>
            
            <div style={{ marginBottom: '30px' }}>
                <h3 style={{ color: '#495057', marginBottom: '10px' }}>Token:</h3>
                <pre style={{ 
                    backgroundColor: '#fff', 
                    padding: '15px', 
                    borderRadius: '5px',
                    overflow: 'auto',
                    border: '1px solid #dee2e6',
                    fontSize: '14px',
                    lineHeight: '1.5'
                }}>
                    {token}
                </pre>
            </div>
            
            <div>
                <h3 style={{ color: '#495057', marginBottom: '10px' }}>Headers:</h3>
                <pre style={{ 
                    backgroundColor: '#fff', 
                    padding: '15px', 
                    borderRadius: '5px',
                    overflow: 'auto',
                    border: '1px solid #dee2e6',
                    fontSize: '14px',
                    lineHeight: '1.5'
                }}>
                    {JSON.stringify(headers, null, 2)}
                </pre>
            </div>
        </div>
    );
}

export default TokenTest; 