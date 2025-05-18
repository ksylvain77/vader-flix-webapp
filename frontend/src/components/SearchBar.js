import React, { useState, useEffect, useCallback } from 'react';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const debouncedSearch = useCallback(
        (value) => {
            // Only trigger search if there's actual input
            if (value.trim().length > 0) {
                const timer = setTimeout(() => {
                    onSearch(value);
                    console.log('Search term:', value);
                }, 300);

                return () => clearTimeout(timer);
            }
        },
        [onSearch]
    );

    useEffect(() => {
        debouncedSearch(searchTerm);
    }, [searchTerm, debouncedSearch]);

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search for TV shows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <style>{`
                .search-bar {
                    margin-bottom: 20px;
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto 20px;
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
            `}</style>
        </div>
    );
};

export default SearchBar; 