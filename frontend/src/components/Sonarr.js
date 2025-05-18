import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.50.92:3000';

const Sonarr = () => {
  // State management
  const [library, setLibrary] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Handle search
  const handleSearch = async (term) => {
    const trimmedTerm = term.trim();
    if (!trimmedTerm || trimmedTerm.length < 2) {
      setSearchResults([]);
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
      setSearchResults(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search shows');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adding a show
  const handleAddShow = async (show) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      await axios.post(
        `${API_BASE_URL}/api/sonarr/series`,
        show,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Refresh library after adding
      const response = await axios.get(`${API_BASE_URL}/api/sonarr/series`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLibrary(response.data);
      setError(null);
    } catch (err) {
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
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearch(e.target.value);
          }}
          className="search-input"
        />
      </div>

      {/* Error Display */}
      {error && <div className="error-message">{error}</div>}

      {/* Loading State */}
      {isLoading && <div className="loading">Loading...</div>}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="search-results">
          <h2>Search Results</h2>
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
        }
      `}</style>
    </div>
  );
};

export default Sonarr; 