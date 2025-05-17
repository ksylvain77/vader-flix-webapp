# Environment Variables Documentation

## Backend Environment Variables

### Core Application
- `NODE_ENV`: Application environment (development/production/test)
- `PORT`: Port number for the backend server (default: 3000)

### Database Configuration
- `DB_HOST`: Database host address
- `DB_PORT`: Database port number
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name

### Authentication
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRATION`: Token expiration time (default: 1h)

### Plex Integration
- `PLEX_BASE_URL`: Base URL for Plex server
- `PLEX_TOKEN`: Plex authentication token
- `PLEX_LIBRARY_SECTIONS`: Comma-separated list of library section IDs

### Sonarr Integration
- `SONARR_BASE_URL`: Base URL for Sonarr server (e.g., http://localhost:8989)
- `SONARR_API_KEY`: Sonarr API key
- `SONARR_QUALITY_PROFILE_ID`: ID of the quality profile to use (default: 1)
- `SONARR_ROOT_FOLDER_PATH`: Path where Sonarr stores TV shows
- `SONARR_SEASON_FOLDER`: Whether to create season folders (default: true)
- `SONARR_MONITORED`: Whether to monitor shows by default (default: true)
- `SONARR_SEARCH_MISSING`: Whether to search for missing episodes (default: false)

### Docker Configuration
- `CONTAINER_PREFIX`: Prefix for Docker container names
- `NAS_IP`: IP address of the NAS
- `NAS_USER`: NAS username
- `NAS_SSH_PORT`: SSH port for NAS (default: 22)
- `PROJECT_PATH`: Path to project on NAS

### CORS Configuration
- `CORS_ORIGIN`: Allowed origin for CORS (default: http://localhost:3001)

## Frontend Environment Variables

### API Configuration
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_WS_URL`: WebSocket URL

### Plex Configuration
- `REACT_APP_PLEX_URL`: Plex server URL
- `REACT_APP_PLEX_TOKEN`: Plex authentication token

## Docker Environment Variables

### User/Group IDs
- `PUID`: User ID for container
- `PGID`: Group ID for container

## Usage Notes

1. These variables should be set in your Docker Compose files or container environment
2. Never commit sensitive values to version control
3. Use different values for development and production environments
4. Keep a secure backup of your production environment variables

## Security Considerations

1. Use strong, unique passwords
2. Rotate JWT secrets regularly
3. Use different credentials for development and production
4. Restrict access to environment variables to authorized personnel only

## Docker Compose Example

```yaml
version: '3'
services:
  backend:
    environment:
      - NODE_ENV=development
      - DB_HOST=mariadb
      - DB_PORT=3306
      - DB_USER=your_user
      - DB_PASSWORD=your_password
      - DB_NAME=your_database
      - PORT=3000
      - JWT_SECRET=your_secret
      - SONARR_BASE_URL=http://localhost:8989
      - SONARR_API_KEY=your_api_key
      - SONARR_ROOT_FOLDER_PATH=/tv
      # Add other variables as needed
```

## Troubleshooting

If you encounter issues with environment variables:

1. Verify the variable is set in your Docker Compose file
2. Check if the variable is accessible in your application
3. Ensure the variable name matches exactly
4. Check for any typos in variable names
5. Verify the variable is being passed to the container 