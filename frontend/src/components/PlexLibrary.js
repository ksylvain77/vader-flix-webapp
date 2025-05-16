import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlexTokenService from '../services/plexTokenService';

const PlexLibrary = () => {
    const [libraries, setLibraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedServer, setSelectedServer] = useState(null);
    const [selectedLibrary, setSelectedLibrary] = useState(null);
    const [libraryItems, setLibraryItems] = useState([]);

    useEffect(() => {
        fetchServers();
    }, []);

    const fetchServers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://plex.tv/api/servers', {
                headers: PlexTokenService.getHeaders()
            });
            
            // Parse XML response
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response.data, "text/xml");
            const servers = Array.from(xmlDoc.getElementsByTagName('Server'));
            
            if (servers.length === 0) {
                throw new Error('No Plex servers found');
            }

            // Find the most recently updated server
            const latestServer = servers.reduce((latest, current) => {
                const latestUpdated = parseInt(latest.getAttribute('updatedAt'));
                const currentUpdated = parseInt(current.getAttribute('updatedAt'));
                return currentUpdated > latestUpdated ? current : latest;
            });

            // Use local address if available, otherwise fall back to public address
            const localAddresses = latestServer.getAttribute('localAddresses').split(',');
            const serverAddress = localAddresses.length > 0 ? localAddresses[0] : latestServer.getAttribute('address');
            const serverUrl = `${latestServer.getAttribute('scheme')}://${serverAddress}:${latestServer.getAttribute('port')}`;
            
            console.log('Using server URL:', serverUrl);
            setSelectedServer(serverUrl);
            await fetchLibraries(serverUrl);
        } catch (err) {
            console.error('Error fetching servers:', err);
            setError('Failed to fetch Plex servers: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchLibraries = async (serverUrl) => {
        try {
            setLoading(true);
            console.log('Fetching libraries from:', serverUrl);
            const response = await axios.get(`${serverUrl}/library/sections`, {
                headers: PlexTokenService.getHeaders()
            });
            console.log('Library response:', response.data);

            if (!response.data.MediaContainer || !response.data.MediaContainer.Directory) {
                throw new Error('Invalid response format from Plex server');
            }

            const libraries = response.data.MediaContainer.Directory.map(lib => ({
                key: lib.key,
                title: lib.title,
                type: lib.type,
                count: lib.size || '0',
                updatedAt: lib.updatedAt
            }));

            console.log('Final libraries array:', libraries);
            setLibraries(libraries);
            setError(null);
        } catch (err) {
            console.error('Error fetching libraries:', err);
            console.error('Error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            setError('Failed to fetch libraries: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchLibraryItems = async (library) => {
        try {
            setLoading(true);
            setSelectedLibrary(library);
            console.log('Fetching items for library:', library.title);
            
            const response = await axios.get(`${selectedServer}/library/sections/${library.key}/all`, {
                headers: PlexTokenService.getHeaders()
            });
            console.log('Library items response:', response.data);

            if (!response.data.MediaContainer || !response.data.MediaContainer.Metadata) {
                throw new Error('Invalid response format for library items');
            }

            const items = response.data.MediaContainer.Metadata.map(item => ({
                key: item.ratingKey,
                title: item.title,
                year: item.year,
                type: item.type,
                thumb: item.thumb
            }));

            console.log('Library items:', items);
            setLibraryItems(items);
            setError(null);
        } catch (err) {
            console.error('Error fetching library items:', err);
            setError('Failed to fetch library items: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="plex-library">
            <div className="header">
                <h1>Plex Libraries</h1>
                {selectedServer && (
                    <div className="server-info">
                        <button onClick={() => fetchLibraries(selectedServer)} disabled={loading}>
                            {loading ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>
                )}
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
                        <div 
                            key={library.key} 
                            className={`library-card ${selectedLibrary?.key === library.key ? 'selected' : ''}`}
                            onClick={() => fetchLibraryItems(library)}
                        >
                            <div className="library-icon">
                                {library.type === 'movie' ? '🎬' : '📺'}
                            </div>
                            <h2>{library.title}</h2>
                            <div className="library-info">
                                <p>Type: {library.type === 'movie' ? 'Movies' : 'TV Shows'}</p>
                                <p>Items: {library.count}</p>
                                <p>Last Updated: {new Date(parseInt(library.updatedAt) * 1000).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedLibrary && libraryItems.length > 0 && (
                <div className="library-items">
                    <h2>{selectedLibrary.title} Content</h2>
                    <div className="items-grid">
                        {libraryItems.map((item) => (
                            <div key={item.key} className="item-card">
                                {item.thumb && (
                                    <img 
                                        src={`${selectedServer}${item.thumb}?X-Plex-Token=${PlexTokenService.getToken()}`} 
                                        alt={item.title}
                                        className="item-thumbnail"
                                    />
                                )}
                                <div className="item-info">
                                    <h3>{item.title}</h3>
                                    {item.year && <p>Year: {item.year}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
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

                .server-info {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .server-info span {
                    color: #666;
                    font-size: 14px;
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
                    margin-bottom: 40px;
                }

                .library-card {
                    background: white;
                    border-radius: 10px;
                    padding: 20px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    border: 2px solid #E5A00D;
                    transition: transform 0.2s, box-shadow 0.2s;
                    cursor: pointer;
                }

                .library-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                }

                .library-card.selected {
                    border-color: #007bff;
                    background-color: #f8f9fa;
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

                .library-items {
                    margin-top: 40px;
                }

                .library-items h2 {
                    color: #333;
                    margin-bottom: 20px;
                }

                .items-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 20px;
                }

                .item-card {
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    transition: transform 0.2s;
                }

                .item-card:hover {
                    transform: translateY(-5px);
                }

                .item-thumbnail {
                    width: 100%;
                    height: 300px;
                    object-fit: cover;
                }

                .item-info {
                    padding: 15px;
                }

                .item-info h3 {
                    margin: 0 0 10px 0;
                    color: #333;
                    font-size: 16px;
                }

                .item-info p {
                    margin: 5px 0;
                    color: #666;
                    font-size: 14px;
                }

                @media (max-width: 768px) {
                    .libraries-grid {
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    }
                    
                    .items-grid {
                        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                    }
                }
            `}</style>
        </div>
    );
};

export default PlexLibrary; 