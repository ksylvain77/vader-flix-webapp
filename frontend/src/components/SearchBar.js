import React, { useState, useEffect, useCallback } from 'react';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    const debouncedSearch = useCallback(
        (value) => {
            const trimmedValue = value.trim();
            
            // Clear any previous errors
            setError('');

            // Only trigger search if there's actual input
            if (trimmedValue.length > 0) {
                if (trimmedValue.length < 2) {
                    setError('Please enter at least 2 characters');
                    return;
                }

                const timer = setTimeout(() => {
                    onSearch(trimmedValue);
                    console.log('Search term:', trimmedValue);
                }, 300);

                return () => clearTimeout(timer);
            }
        },
        [onSearch]
    );

    useEffect(() => {
        debouncedSearch(searchTerm);
    }, [searchTerm, debouncedSearch]);

    const handleClear = () => {
        setSearchTerm('');
        setError('');
        onSearch(''); // This will trigger a reset of the search results
    };

    return (
        <div className="search-bar">
            <div className="search-input-container">
                <input
                    type="text"
                    placeholder="Search for TV shows..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <button 
                        className="clear-button"
                        onClick={handleClear}
                        aria-label="Clear search"
                    >
                        ×
                    </button>
                )}
            </div>
            {error && <div className="search-error">{error}</div>}
            <style>{`
                .search-bar {
                    margin-bottom: 20px;
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto 20px;
                }

                .search-input-container {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .search-bar input {
                    width: 100%;
                    padding: 12px 20px;
                    font-size: 16px;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    transition: border-color 0.2s;
                }

                .search-bar input:focus {
                    outline: none;
                    border-color: #666;
                }

                .clear-button {
                    position: absolute;
                    right: 10px;
                    background: none;
                    border: none;
                    color: #666;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                }

                .clear-button:hover {
                    background-color: #f0f0f0;
                    color: #333;
                }

                .search-error {
                    color: #d32f2f;
                    font-size: 14px;
                    margin-top: 5px;
                    text-align: center;
                }
            `}</style>
        </div>
    );
};

export default SearchBar; 