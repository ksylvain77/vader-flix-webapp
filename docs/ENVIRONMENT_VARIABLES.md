# Environment Variables Documentation

This document lists all required environment variables for the Vader Flix application. Copy these variables to your `.env` file and update the values according to your environment.

## Application Environment
```env
# The environment the application is running in
NODE_ENV=development  # Options: development, production, test
PORT=3000            # The port the server will listen on
```

## CORS Configuration
```env
# CORS settings for the API
CORS_ORIGIN=http://localhost:3001  # The origin allowed to access the API
```

## Database Configuration
```env
# MariaDB connection settings
DB_HOST=mariadb      # Database host
DB_PORT=3306        # Database port
DB_NAME=vaderflix   # Database name
DB_USER=vaderflix   # Database user
DB_PASSWORD=your_secure_password_here  # Database password
```

## Authentication
```env
# JWT settings
JWT_SECRET=your_jwt_secret_here  # Secret key for JWT tokens
TOKEN_EXPIRATION=1h              # Token expiration time
```

## Plex Configuration
```env
# Plex Media Server settings
PLEX_BASE_URL=http://192.168.50.92:32400  # Plex server URL
PLEX_TOKEN=your_plex_token_here           # Plex authentication token
PLEX_LIBRARY_SECTION_IDS=1,2,3            # Comma-separated list of library section IDs
```

## Docker/NAS Configuration
```env
# Docker and NAS settings
CONTAINER_PREFIX=vader-flix                                    # Prefix for Docker containers
NAS_IP=192.168.50.92                                          # NAS IP address
NAS_USER=your_nas_username                                    # NAS username
NAS_SSH_PORT=22                                               # SSH port for NAS
NAS_PROJECT_PATH=/volume1/docker/projects/vader-flix-webapp   # Project path on NAS
```

## Logging
```env
# Logging configuration
LOG_LEVEL=debug   # Options: error, warn, info, debug
LOG_FORMAT=dev    # Options: dev, combined, common, short, tiny
```

## Environment-Specific Notes

### Development
- Use `NODE_ENV=development`
- Set `CORS_ORIGIN` to your frontend development server
- Use development database credentials

### Production
- Use `NODE_ENV=production`
- Set `CORS_ORIGIN` to your production domain
- Use production database credentials
- Set appropriate logging levels

### Test
- Use `NODE_ENV=test`
- Use test database credentials
- Set `LOG_LEVEL=error` to minimize test output

## Security Notes
1. Never commit the actual `.env` file to version control
2. Use strong, unique passwords for all services
3. Regularly rotate sensitive credentials
4. Use different credentials for development and production
5. Keep your JWT secret secure and complex 