# Vader Flix Frontend Setup Summary

## Environment Details
- **Host System**: Synology NAS DS423+ running DSM 7.2.2
- **Project Location**: `/volume1/docker/projects/vader-flix-webapp/frontend`
- **Container Name**: `vader-flix-frontend`
- **Access URL**: `http://[NAS_IP]:3001` (mapped to port 3000 in container)
- **Network**: Using Docker bridge network, container accessible at `172.25.0.2:3000`

## Container Configuration
- **Docker Compose File**: `/volume1/docker/projects/vader-flix-webapp/frontend/compose.yaml`
- **Base Image**: `node:16`
- **Working Directory**: `/app`
- **Volume Mapping**: `/volume1/docker/projects/vader-flix-webapp/frontend:/app`
- **Ports**: `3001:3000` (host:container)
- **Environment Variables**:
  - `PUID=1027` (dockerlimited user)
  - `PGID=65536` (dockergroup)
  - `NODE_ENV=development`
  - `REACT_APP_API_URL=http://vader-flix-backend:3000`
- **Command**: `bash -c "npm install && npm start"`

## File Permissions
- **Owner**: dockerlimited (UID 1027)
- **Group**: dockergroup (GID 65536)
- **Permissions**: 775 (drwxrwxr-x for directories, -rwxrwxr-x for files)

## Project Structure
```
/volume1/docker/projects/vader-flix-webapp/frontend/
├── compose.yaml
├── node_modules/
├── package.json
├── package-lock.json
├── public/
│   └── index.html
└── src/
    ├── App.js
    ├── index.css
    └── index.js
```

## Key Files Content
### compose.yaml
```yaml
version: '3'
services:
  frontend:
    container_name: vader-flix-frontend
    image: node:16
    restart: unless-stopped
    working_dir: /app
    environment:
      - PUID=1027
      - PGID=65536
      - NODE_ENV=development
      - REACT_APP_API_URL=http://vader-flix-backend:3000
    volumes:
      - /volume1/docker/projects/vader-flix-webapp/frontend:/app
    ports:
      - 3001:3000
    command: bash -c "npm install && npm start"
```

### package.json
```json
{
  "name": "vader-flix-frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "axios": "^0.26.1",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-router-dom": "^6.3.0",
    "react-scripts": "5.0.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

## Integration Notes
- The frontend container communicates with the backend using the container name `vader-flix-backend:3000` as the API URL
- Container uses the same permission structure as the backend container (PUID=1027, PGID=65536)
- React development server automatically reloads when files are changed

## Development Workflow
1. Edit files through DSM File Station or preferred editor
2. Changes are automatically detected by the React development server
3. View changes at `http://[NAS_IP]:3001`
4. For production builds, use `npm run build` instead of `npm start`

This configuration follows the same pattern as the backend container for consistency and reliability.
