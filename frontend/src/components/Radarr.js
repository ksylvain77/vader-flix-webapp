import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Radarr = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageErrors, setImageErrors] = useState(new Set());

    const fetchMovies = useCallback(async (signal) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.get('http://192.168.50.92:3000/api/radarr/movies', {
                headers: { Authorization: `Bearer ${token}` },
                signal
            });

            setMovies(response.data);
            setLoading(false);
            setError(null);
        } catch (err) {
            if (axios.isCancel(err)) {
                console.log('Request cancelled');
                return;
            }
            setError(err.response?.data?.message || 'Failed to fetch movies');
            setLoading(false);
            setMovies([]);
            console.error('Error fetching movies:', err);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError(null);
        setImageErrors(new Set());

        fetchMovies(controller.signal);

        return () => {
            controller.abort();
        };
    }, [fetchMovies]);

    const handleImageError = (movieId) => {
        setImageErrors(prev => new Set([...prev, movieId]));
    };

    if (loading) return <div>Loading movies...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;
    if (!movies.length) return <div>No movies found</div>;

    return (
        <div className="radarr">
            <h1>Movies</h1>
            <div className="movies-grid">
                {movies.map((movie) => (
                    <div key={movie.id} className="movie-card">
                        <div className="movie-poster-container">
                            {!imageErrors.has(movie.id) && movie.images?.[0]?.url ? (
                                <img 
                                    src={movie.images[0].url} 
                                    alt={movie.title}
                                    className="movie-poster"
                                    onError={() => handleImageError(movie.id)}
                                />
                            ) : (
                                <div className="movie-poster-placeholder">
                                    <span>{movie.title}</span>
                                </div>
                            )}
                        </div>
                        <div className="movie-info">
                            <h2>{movie.title}</h2>
                            <p>Status: {movie.status}</p>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .radarr {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                h1 {
                    text-align: center;
                    color: #333;
                    margin-bottom: 30px;
                }

                .movies-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 20px;
                    padding: 20px;
                }

                .movie-card {
                    background: white;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    transition: transform 0.2s;
                }

                .movie-card:hover {
                    transform: translateY(-5px);
                }

                .movie-poster-container {
                    width: 100%;
                    height: 300px;
                    position: relative;
                    background: #f5f5f5;
                }

                .movie-poster {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .movie-poster-placeholder {
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

                .movie-info {
                    padding: 15px;
                }

                .movie-info h2 {
                    margin: 0 0 10px 0;
                    font-size: 1.1em;
                    color: #333;
                }

                .movie-info p {
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

export default Radarr; 