import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Sonarr = () => {
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchShows = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://192.168.50.92:3000/api/sonarr/series', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setShows(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch shows');
                setLoading(false);
                console.error('Error fetching shows:', err);
            }
        };

        fetchShows();
    }, []);

    if (loading) return <div>Loading shows...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="sonarr">
            <h1>TV Shows</h1>
            <div className="shows-grid">
                {shows.map((show) => (
                    <div key={show.id} className="show-card">
                        <img 
                            src={show.images?.[0]?.url} 
                            alt={show.title}
                            className="show-poster"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                            }}
                        />
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

                .show-poster {
                    width: 100%;
                    height: 300px;
                    object-fit: cover;
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
            `}</style>
        </div>
    );
};

export default Sonarr; 