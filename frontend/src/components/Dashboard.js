import React from 'react';

const Dashboard = () => {
    const services = [
        { name: 'Plex', icon: '🎬', color: '#E5A00D' },
        { name: 'Sonarr', icon: '📺', color: '#2196F3' },
        { name: 'Radarr', icon: '🎥', color: '#4CAF50' },
        { name: 'Prowlarr', icon: '🔍', color: '#9C27B0' },
        { name: 'qBittorrent', icon: '⬇️', color: '#FF5722' },
        { name: 'Torrent', icon: '🌊', color: '#607D8B' }
    ];

    return (
        <div className="dashboard">
            <h1>Media Dashboard</h1>
            <div className="services-grid">
                {services.map((service) => (
                    <div 
                        key={service.name} 
                        className="service-card"
                        style={{ borderColor: service.color }}
                    >
                        <div className="service-icon" style={{ backgroundColor: service.color }}>
                            {service.icon}
                        </div>
                        <h2>{service.name}</h2>
                        <div className="service-status">
                            <span className="status-dot"></span>
                            <span className="status-text">Not Connected</span>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .dashboard {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                h1 {
                    text-align: center;
                    color: #333;
                    margin-bottom: 30px;
                }

                .services-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    padding: 20px;
                }

                .service-card {
                    background: white;
                    border-radius: 10px;
                    padding: 20px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    border: 2px solid;
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .service-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                }

                .service-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    margin: 0 auto 15px;
                    color: white;
                }

                .service-card h2 {
                    text-align: center;
                    margin: 10px 0;
                    color: #333;
                }

                .service-status {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin-top: 15px;
                }

                .status-dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background-color: #ccc;
                }

                .status-text {
                    color: #666;
                    font-size: 14px;
                }

                @media (max-width: 768px) {
                    .services-grid {
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    }
                }
            `}</style>
        </div>
    );
};

export default Dashboard; 