# Vader Flix

A modern streaming platform built with Node.js, Express, and MariaDB, containerized with Docker.

## 🚀 Features

- User authentication and authorization
- Media streaming capabilities
- Content request system
- Real-time WebSocket communication
- RESTful API architecture
- Secure database management
- Docker containerization
- Plex media server integration
- Global search across all media libraries
- Real-time search filtering



## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MariaDB
- **ORM**: Sequelize
- **Authentication**: JWT
- **Containerization**: Docker (via Synology Container Manager)
- **API**: RESTful
- **Frontend**: React.js
- **Media Integration**: Plex Media Server

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 16 or higher
- Git

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/kevinsylvain/vader-flix-webapp.git
   cd vader-flix-webapp
   ```

2. **Start the Database**
   ```bash
   cd db
   docker-compose up -d
   ```
   Note: This project uses Synology Container Manager for Docker orchestration, but the compose files are compatible with standard Docker Compose.

3. **Start the Application**
   ```bash
   ./restart-docker.sh
   ```
   This script will:
   - Start the backend API server
   - Start the frontend application
   - Configure all necessary environment variables

4. **Access the Application**
   - Frontend: `http://localhost:3001`
   - Backend API: `http://localhost:3000`

Note: The `restart-docker.sh` script uses the following configuration:
- NAS IP: 192.168.50.92
- NAS User: kevin
- NAS SSH Port: 22
- Project Path: /volume1/docker/projects/vader-flix-webapp
- Container Prefix: vader-flix

> **Note**: Currently testing Git hook functionality to ensure proper deployment workflow.
> **Note**: Testing post-commit hook for automated deployment verification.
> **Note**: Running another hook test to verify deployment pipeline.
> **Note**: Testing hook trigger with README update.
> **Note**: Testing with core.logAllRefUpdates enabled.

## 🔧 Environment Variables

### Backend
- `PORT`: Server port (default: 3000)
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `JWT_SECRET`: Secret key for JWT

### Database
- `MYSQL_ROOT_PASSWORD`: Root password
- `MYSQL_DATABASE`: Database name
- `MYSQL_USER`: Database user
- `MYSQL_PASSWORD`: Database password

## 📁 Project Structure

```
vader-flix-webapp/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── compose.yaml
├── db/
│   ├── data/
│   └── compose.yaml
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── PlexLibrary.js
    │   └── services/
    │       └── plexTokenService.js
    └── compose.yaml
```

## 🔐 Security

- JWT-based authentication
- Secure password hashing
- CORS enabled
- Environment variables for sensitive data
- Docker container isolation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Kevin Sylvain - Initial work

## 🙏 Acknowledgments

- Express.js team
- Docker team
- MariaDB team 



## 🧪 Running Tests

- Tests are located in `backend/__tests__`.
- Tests use a separate test database configured in `backend/config/db.config.testconfig.js`.
- The test database must exist and the test user must have privileges (see project setup).
- The JWT secret for tests is set to `DeathStarDesignFlaw` by default.
- To run tests:
  ```bash
  cd backend
  npm test
  ```

Test push at Sat May 17 10:42:40 EDT 2025

Testing hook deployment at Sat May 17 10:57:22 EDT 2025

Testing hook deployment at Sat May 17 10:59:00 EDT 2025

Testing hook deployment at Sat May 17 11:00:23 EDT 2025

Testing hook deployment at Sat May 17 11:11:05 EDT 2025

Testing hook deployment at Sat May 17 11:16:20 EDT 2025

Final full integration hook at Sat May 17 11:23:16 EDT 2025

Testing hook deployment at Sat May 17 11:28:46 EDT 2025

Testing hook deployment at Sat May 17 11:59:36 EDT 2025

test

Testing hook deployment at Sat May 17 12:05:00 EDT 2025
