import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard', path: '/', icon: '🏠' },
        { name: 'Plex', path: '/plex', icon: '🎬' },
        { name: 'Sonarr', path: '/sonarr', icon: '📺' },
        { name: 'Radarr', path: '/radarr', icon: '🎥' },
        { name: 'Prowlarr', path: '/prowlarr', icon: '🔍' },
        { name: 'qBittorrent', path: '/qbittorrent', icon: '⬇️' }
    ];

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <span className="logo">VaderFlix</span>
                <button 
                    className="menu-toggle"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <span className="hamburger"></span>
                </button>
            </div>
            
            <div className={`nav-items ${isMenuOpen ? 'active' : ''}`}>
                {navItems.map((item) => (
                    <button
                        key={item.name}
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        onClick={() => {
                            navigate(item.path);
                            setIsMenuOpen(false);
                        }}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-text">{item.name}</span>
                    </button>
                ))}
            </div>

            <style>{`
                .navbar {
                    background: white;
                    padding: 1rem;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                }

                .navbar-brand {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .logo {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #333;
                }

                .menu-toggle {
                    display: none;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0.5rem;
                }

                .hamburger {
                    display: block;
                    width: 25px;
                    height: 3px;
                    background: #333;
                    position: relative;
                    transition: all 0.3s;
                }

                .hamburger::before,
                .hamburger::after {
                    content: '';
                    position: absolute;
                    width: 25px;
                    height: 3px;
                    background: #333;
                    transition: all 0.3s;
                }

                .hamburger::before {
                    transform: translateY(-8px);
                }

                .hamburger::after {
                    transform: translateY(8px);
                }

                .nav-items {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                }

                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    border: none;
                    background: none;
                    cursor: pointer;
                    border-radius: 8px;
                    transition: all 0.2s;
                    color: #666;
                }

                .nav-item:hover {
                    background: #f5f5f5;
                    color: #333;
                }

                .nav-item.active {
                    background: #f0f0f0;
                    color: #333;
                    font-weight: 500;
                }

                .nav-icon {
                    font-size: 1.2rem;
                }

                @media (max-width: 768px) {
                    .menu-toggle {
                        display: block;
                    }

                    .nav-items {
                        display: none;
                        flex-direction: column;
                        width: 100%;
                    }

                    .nav-items.active {
                        display: flex;
                    }

                    .nav-item {
                        width: 100%;
                        justify-content: flex-start;
                    }
                }
            `}</style>
        </nav>
    );
};

export default Navbar; 