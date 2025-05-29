# Vader Flix

> **Note**: Reverted to homepage-dashboard branch (May 19, 2025) to restore stable version.

A modern streaming platform built with Node.js, Express, and MariaDB, containerized with Docker. Integrates with a complete media management stack including Radarr, Sonarr, Prowlarr, and Overseer.

# 🎬 VaderFlix Dashboard

A modern, containerized dashboard solution combining Homepage and a custom portal for managing your media services. Seamlessly integrates with your existing media management stack.

## 🌟 Features

- **Homepage Dashboard**: A beautiful, customizable dashboard for your services
- **VaderFlix Portal**: Custom portal for managing media services
- **Dockerized**: Easy deployment with Docker Compose
- **Secure**: Built with security best practices
- **Network Integration**: Seamless integration with Synology network
- **Media Management**: Direct integration with Overseer for media requests
- **Authentication**: Secure user authentication with email verification

## 🚀 Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/vader-flix-webapp.git
   cd vader-flix-webapp
   ```

2. Configure your environment:
   - Edit the `docker-compose.yml` file to set your desired configuration
   - Update the `HOMEPAGE_ALLOWED_HOSTS` to match your network setup
   - Ensure port 5055 is forwarded for Overseer access

3. Start the services:
   ```bash
   docker-compose up -d
   ```

4. Access the services:
   - Homepage Dashboard: `http://192.168.50.92:3000`
   - VaderFlix Portal: `http://192.168.50.92:3001`

## 🏗️ Architecture

The project consists of multiple components working together:

### VaderFlix Webapp
- **Homepage Dashboard** (Port 3000)
  - Customizable dashboard interface
  - Persistent configuration through volume mounting
  - Configurable through environment variables

- **VaderFlix Portal** (Port 3001)
  - Node.js/Express backend
  - User authentication system
  - Email integration
  - Proxy middleware for service management
  - Seamless Overseer integration

### Media Management Stack
- **Overseer** (Port 5055)
  - Media request management
  - Integrated with VaderFlix Portal
  - Requires port forwarding for external access

- ***arr Stack** (Separate Docker Compose)
  - Radarr: Movie management
  - Sonarr: TV show management
  - Prowlarr: Indexer management
  - Flare Solver: Anti-bot protection

## 🔧 Configuration

### Environment Variables
- `PUID`: User ID for file permissions
- `PGID`: Group ID for file permissions
- `HOMEPAGE_VAR_TITLE`: Dashboard title
- `HOMEPAGE_VAR_APPLICATION_NAME`: Application name
- `HOMEPAGE_ALLOWED_HOSTS`: Allowed host addresses

### Volumes
- `./config:/app/config`: Homepage configuration
- `./portal-data:/usr/src/app/data`: Portal data persistence

### Network Requirements
- Port 3000: Homepage Dashboard
- Port 3001: VaderFlix Portal
- Port 5055: Overseer (requires forwarding for external access)

## 🔒 Security

- No new privileges security option enabled
- Log rotation configured
- Session management
- Secure password handling
- Email verification for new accounts
- Port forwarding for secure external access

## 📝 Logging

Both services are configured with JSON file logging:
- Maximum log file size: 10MB
- Maximum number of log files: 3
- Automatic log rotation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Homepage](https://github.com/gethomepage/homepage) for the dashboard interface
- [Overseer](https://overseerr.dev/) for media request management
- All contributors and users of the project
