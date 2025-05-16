import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlexTokenService from '../services/plexTokenService';

const PlexLibrary = () => {
    const [libraries, setLibraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLibraries();
    }, []);

    const fetchLibraries = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://plex.tv/api/v2/libraries', {
                headers: PlexTokenService.getHeaders()
            });
            setLibraries(response.data.MediaContainer.Directory);
            setError(null);
        } catch (err) {
            setError('Failed to fetch libraries: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="plex-library">
            <div className="header">
                <h1>Plex Libraries</h1>
                <button onClick={fetchLibraries} disabled={loading}>
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="loading">Loading libraries...</div>
            ) : (
                <div className="libraries-grid">
                    {libraries.map((library) => (
                        <div key={library.key} className="library-card">
                            <div className="library-icon">
                                {library.type === 'movie' ? '🎬' : '📺'}
                            </div>
                            <h2>{library.title}</h2>
                            <div className="library-info">
                                <p>Type: {library.type}</p>
                                <p>Items: {library.size}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .plex-library {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                }

                h1 {
                    color: #333;
                    margin: 0;
                }

                button {
                    padding: 10px 20px;
                    background-color: #E5A00D;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.2s;
                }

                button:hover {
                    background-color: #C48A0B;
                }

                button:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                }

                .error-message {
                    background-color: #fff3f3;
                    border: 1px solid #ff9999;
                    border-radius: 4px;
                    color: #cc0000;
                    padding: 15px;
                    margin-bottom: 20px;
                }

                .loading {
                    text-align: center;
                    color: #666;
                    font-size: 18px;
                    margin: 40px 0;
                }

                .libraries-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                }

                .library-card {
                    background: white;
                    border-radius: 10px;
                    padding: 20px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    border: 2px solid #E5A00D;
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .library-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                }

                .library-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background-color: #E5A00D;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    margin: 0 auto 15px;
                    color: white;
                }

                .library-card h2 {
                    text-align: center;
                    margin: 10px 0;
                    color: #333;
                }

                .library-info {
                    margin-top: 15px;
                    color: #666;
                }

                .library-info p {
                    margin: 5px 0;
                }

                @media (max-width: 768px) {
                    .libraries-grid {
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    }
                }
            `}</style>
        </div>
    );
};

export default PlexLibrary; 