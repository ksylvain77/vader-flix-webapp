# Vader Flix

A modern streaming platform built with Node.js, Express, and MariaDB, containerized with Docker.

## 🚀 Features

- User authentication and authorization
- Media streaming capabilities
- Content request system
- RESTful API architecture
- Secure database management
- Docker containerization

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MariaDB
- **ORM**: Sequelize
- **Authentication**: JWT
- **Containerization**: Docker (via Synology Container Manager)
- **API**: RESTful

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

3. **Start the Backend**
   ```bash
   cd backend
   docker-compose up -d
   ```

4. **Access the API**
   The API will be available at `http://localhost:3000`

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
# Local development test
// Test comment
// Simplified hook test

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
