import React, { useState, useEffect, useRef } from 'react';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const timeoutRef = useRef(null);

    useEffect(() => {
        console.log('SearchBar useEffect firing');
        console.log('Current searchTerm:', searchTerm);
        console.log('TimeoutRef before setTimeout:', timeoutRef.current);

        const trimmedValue = searchTerm.trim();
        setError('');

        if (trimmedValue.length > 0) {
            if (trimmedValue.length < 2) {
                setError('Please enter at least 2 characters');
                return;
            }

            // Only clear if there's an existing timer that hasn't fired
            if (timeoutRef.current) {
                console.log('Clearing existing timeout');
                clearTimeout(timeoutRef.current);
            }

            // Set new timeout
            timeoutRef.current = setTimeout(() => {
                console.log('Debounced onSearch firing with:', trimmedValue);
                onSearch(trimmedValue);
                timeoutRef.current = null;
            }, 300);
        }

        // Cleanup function
        return () => {
            if (timeoutRef.current) {
                console.log('Cleanup: clearing timeout on unmount/update');
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [searchTerm]); // Removed onSearch from dependencies

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