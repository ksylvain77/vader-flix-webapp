import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';

const Sonarr = () => {
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageErrors, setImageErrors] = useState(new Set());

    const fetchShows = useCallback(async (signal) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.get('http://192.168.50.92:3000/api/sonarr/series', {
                headers: { Authorization: `Bearer ${token}` },
                signal
            });

            setShows(response.data);
            setLoading(false);
            setError(null);
        } catch (err) {
            if (axios.isCancel(err)) {
                console.log('Request cancelled');
                return;
            }
            setError(err.response?.data?.message || 'Failed to fetch shows');
            setLoading(false);
            setShows([]);
            console.error('Error fetching shows:', err);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError(null);
        setImageErrors(new Set());

        fetchShows(controller.signal);

        return () => {
            controller.abort();
        };
    }, [fetchShows]);

    const handleImageError = (showId) => {
        setImageErrors(prev => new Set([...prev, showId]));
    };

    const handleSearch = (searchTerm) => {
        // For now, just log the search term
        console.log('Searching for:', searchTerm);
    };

    if (loading) return <div>Loading shows...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;
    if (!shows.length) return <div>No shows found</div>;

    return (
        <div className="sonarr">
            <h1>TV Shows</h1>
            <SearchBar onSearch={handleSearch} />
            <div className="shows-grid">
                {shows.map((show) => (
                    <div key={show.id} className="show-card">
                        <div className="show-poster-container">
                            {!imageErrors.has(show.id) && show.images?.[0]?.url ? (
                                <img 
                                    src={show.images[0].url} 
                                    alt={show.title}
                                    className="show-poster"
                                    onError={() => handleImageError(show.id)}
                                />
                            ) : (
                                <div className="show-poster-placeholder">
                                    <span>{show.title}</span>
                                </div>
                            )}
                        </div>
                        <div className="show-info">
                            <h2>{show.title}</h2>
                            <p>Status: {show.status}</p>
                            <p>Seasons: {show.seasonCount}</p>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .sonarr {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                h1 {
                    text-align: center;
                    color: #333;
                    margin-bottom: 30px;
                }

                .shows-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 20px;
                    padding: 20px;
                }

                .show-card {
                    background: white;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    transition: transform 0.2s;
                }

                .show-card:hover {
                    transform: translateY(-5px);
                }

                .show-poster-container {
                    width: 100%;
                    height: 300px;
                    position: relative;
                    background: #f5f5f5;
                }

                .show-poster {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .show-poster-placeholder {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #e0e0e0;
                    color: #666;
                    text-align: center;
                    padding: 10px;
                    font-size: 0.9em;
                }

                .show-info {
                    padding: 15px;
                }

                .show-info h2 {
                    margin: 0 0 10px 0;
                    font-size: 1.1em;
                    color: #333;
                }

                .show-info p {
                    margin: 5px 0;
                    color: #666;
                    font-size: 0.9em;
                }

                .error-message {
                    color: #d32f2f;
                    text-align: center;
                    padding: 20px;
                    font-size: 1.1em;
                }
            `}</style>
        </div>
    );
};

export default Sonarr; 