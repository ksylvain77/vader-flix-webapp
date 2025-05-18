import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.50.92:3000';
const SEARCH_DEBOUNCE_MS = 500; // Half second delay

const Sonarr = () => {
  // State management
  const [library, setLibrary] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Refs for search debouncing
  const searchTimeoutRef = useRef(null);
  const currentSearchTermRef = useRef('');

  // Fetch library on mount
  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const response = await axios.get(`${API_BASE_URL}/api/sonarr/series`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLibrary(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch library');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLibrary();
  }, []);

  // Handle search with debouncing
  const handleSearch = async (term) => {
    const trimmedTerm = term.trim();
    
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Don't search if term is too short
    if (!trimmedTerm || trimmedTerm.length < 2) {
      setSearchResults([]);
      currentSearchTermRef.current = '';
      return;
    }

    // Don't search if term hasn't changed
    if (trimmedTerm === currentSearchTermRef.current) {
      return;
    }

    // Update current search term before setting up the timeout
    currentSearchTermRef.current = trimmedTerm;

    // Set up new timeout
    searchTimeoutRef.current = setTimeout(async () => {
      // Double check that this is still the current search term
      if (trimmedTerm !== currentSearchTermRef.current) {
        return;
      }

      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const response = await axios.get(
          `${API_BASE_URL}/api/sonarr/search?term=${encodeURIComponent(trimmedTerm)}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        // Only update results if this is still the current search term
        if (trimmedTerm === currentSearchTermRef.current) {
          setSearchResults(response.data);
          setError(null);
        }
      } catch (err) {
        // Only show error if this is still the current search term
        if (trimmedTerm === currentSearchTermRef.current) {
          setError(err.response?.data?.message || 'Failed to search shows');
          setSearchResults([]);
        }
      } finally {
        // Only update loading state if this is still the current search term
        if (trimmedTerm === currentSearchTermRef.current) {
          setIsLoading(false);
        }
      }
    }, SEARCH_DEBOUNCE_MS);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Handle search input change
  const handleSearchInputChange = (e) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);
    handleSearch(newTerm);
  };

  // Handle adding a show
  const handleAddShow = async (show) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      // Include ALL seasons including season 0 (specials) and set them all as monitored
      const allSeasons = show.seasons.map(season => ({
        seasonNumber: season.seasonNumber,
        monitored: true,
        statistics: {
          episodeFileCount: 0,
          episodeCount: season.episodeCount || 0,
          totalEpisodeCount: season.episodeCount || 0,
          sizeOnDisk: 0,
          percentOfEpisodes: 0
        }
      }));

      // Prepare the show data with explicit monitoring options
      const showToAdd = {
        tvdbId: show.tvdbId,
        title: show.title,
        titleSlug: show.titleSlug,
        images: show.images,
        year: show.year,
        monitored: true,
        qualityProfileId: 1,
        languageProfileId: 1,
        rootFolderPath: "/data/media/tv",
        seasons: allSeasons,
        addOptions: {
          searchForMissingEpisodes: true,
          monitor: "missing"
        }
      };

      // Step 1: Add the series
      const addResponse = await axios.post(
        `${API_BASE_URL}/api/sonarr/series`,
        showToAdd,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Step 2: Update the series to set it as monitored
      const updatedSeries = {
        ...addResponse.data,
        monitored: true,
        seasons: addResponse.data.seasons.map(season => ({
          ...season,
          monitored: true
        }))
      };

      const updateResponse = await axios.put(
        `${API_BASE_URL}/api/sonarr/series/${addResponse.data.id}`,
        updatedSeries,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Step 3: Trigger a search for missing episodes
      const commandPayload = {
        name: 'SeriesSearch',
        seriesId: addResponse.data.id
      };

      await axios.post(
        `${API_BASE_URL}/api/sonarr/command`,
        commandPayload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Step 4: Refresh the library
      const libraryResponse = await axios.get(`${API_BASE_URL}/api/sonarr/series`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLibrary(libraryResponse.data);
      setError(null);
      setSearchResults([]); // Clear search results after successful add
    } catch (err) {
      console.error('❌ Sonarr Error:', {
        error: err.message,
        status: err.response?.status,
        responseData: err.response?.data,
        step: err.config?.url?.includes('/series/') ? 'Update' : 'Add'
      });
      setError(err.response?.data?.message || 'Failed to add show');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sonarr-container">
      <h1>Sonarr TV Shows</h1>
      
      {/* Search Section */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search for shows..."
          value={searchTerm}
          onChange={handleSearchInputChange}
          className="search-input"
        />
      </div>

      {/* Error Display */}
      {error && <div className="error-message">{error}</div>}

      {/* Loading State */}
      {isLoading && !searchResults.length && (
        <div className="loading">
          <div className="loading-spinner"></div>
          <div>Searching...</div>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="search-results">
          <h2>Search Results</h2>
          {isLoading && (
            <div className="loading-indicator">
              <div className="loading-spinner"></div>
              <div>Updating results...</div>
            </div>
          )}
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Year</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((show) => (
                <tr key={show.tvdbId}>
                  <td>{show.title}</td>
                  <td>{show.year}</td>
                  <td>
                    <button
                      onClick={() => handleAddShow(show)}
                      disabled={isLoading}
                    >
                      Add
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Library Display */}
      <div className="library">
        <h2>Your Library</h2>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Seasons</th>
            </tr>
          </thead>
          <tbody>
            {library.map((show) => (
              <tr key={show.id}>
                <td>{show.title}</td>
                <td>{show.status}</td>
                <td>{show.statistics?.seasonCount || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .sonarr-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          color: #222;
        }

        h1, h2 {
          color: #222;
          margin-bottom: 1rem;
        }

        h1 {
          font-size: 2rem;
          border-bottom: 2px solid #eee;
          padding-bottom: 0.5rem;
        }

        h2 {
          font-size: 1.5rem;
          margin-top: 2rem;
        }

        .search-section {
          margin: 20px 0;
        }

        .search-input {
          width: 100%;
          padding: 8px;
          font-size: 16px;
          border: 2px solid #ddd;
          border-radius: 4px;
          background-color: #fff;
          color: #222;
          transition: border-color 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #007bff;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          background-color: #fff;
          border: 1px solid #ddd;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        th, td {
          padding: 12px;
          text-align: left;
          border: 1px solid #ddd;
          color: #222;
        }

        th {
          background-color: #f8f9fa;
          font-weight: 600;
        }

        tbody tr:nth-child(even) {
          background-color: #f8f9fa;
        }

        tbody tr:hover {
          background-color: #f1f3f5;
        }

        button {
          padding: 6px 12px;
          background-color: #0066cc;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        button:hover {
          background-color: #0052a3;
        }

        button:disabled {
          background-color: #e9ecef;
          color: #6c757d;
          cursor: not-allowed;
        }

        .error-message {
          color: #842029;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #f5c2c7;
          border-radius: 4px;
          background-color: #f8d7da;
          font-weight: 500;
        }

        .loading {
          text-align: center;
          padding: 20px;
          color: #495057;
          font-weight: 500;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .loading-spinner {
          width: 30px;
          height: 30px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #0066cc;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Sonarr; 