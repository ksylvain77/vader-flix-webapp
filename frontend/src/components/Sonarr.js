import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';

const API_BASE_URL = 'http://192.168.50.92:3000';

// Helper function to normalize strings for comparison
const normalize = (str) => {
  return str.toLowerCase().trim();
};

// Levenshtein distance implementation for fuzzy matching
const levenshtein = (a, b) => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + substitutionCost
      );
    }
  }

  return matrix[b.length][a.length];
};

// Filter and sort results based on search term
const filterAndSortResults = (results, searchTerm) => {
  if (!searchTerm) return results;

  const normalizedSearch = normalize(searchTerm);
  return results
    .map(show => ({
      ...show,
      matchScore: Math.min(
        levenshtein(normalize(show.title), normalizedSearch),
        levenshtein(normalize(show.titleSlug || ''), normalizedSearch)
      )
    }))
    .filter(show => show.matchScore <= 3) // Allow for some typos/fuzzy matching
    .sort((a, b) => a.matchScore - b.matchScore);
};

const Sonarr = () => {
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageErrors, setImageErrors] = useState(new Set());
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

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

    const handleSearch = useCallback(async (term) => {
        console.log('handleSearch called with term:', term);
        if (!term) {
            setSearchResults([]);
            return;
        }

        try {
            console.log('Fetching from backend...');
            const response = await axios.get(`${API_BASE_URL}/api/sonarr/search?term=${encodeURIComponent(term)}`);
            console.log('Search response received:', response.data);
            
            // Filter and sort results before updating state
            const filteredResults = filterAndSortResults(response.data.results, term);
            setSearchResults(filteredResults);
        } catch (error) {
            console.error('Error searching shows:', error);
            setError('Failed to search shows. Please try again.');
        }
    }, []);

    if (loading) return <div>Loading shows...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;

    const displayShows = searchResults.length > 0 ? searchResults : shows;

    return (
        <div className="sonarr">
            <h1>TV Shows</h1>
            <SearchBar onSearch={handleSearch} />
            {isSearching && <div className="searching">Searching...</div>}
            {!isSearching && displayShows.length === 0 && <div>No shows found</div>}
            <div className="shows-grid">
                {displayShows.map((show) => (
                    <div key={show.id || `show-${show.title}`} className="show-card">
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

                .searching {
                    text-align: center;
                    color: #666;
                    margin: 20px 0;
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