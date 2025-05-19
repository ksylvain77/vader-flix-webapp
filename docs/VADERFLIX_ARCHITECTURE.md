# VaderFlix Media Server Architecture

## 1. Project Structure & Architecture

### Directory Organization
```
vader-flix-webapp/
├── config/                 # Configuration files for services
├── portal/                # User portal application
│   ├── public/           # Static files and frontend assets
│   ├── server.js         # Express.js server entry point
│   ├── package.json      # Node.js dependencies
│   └── Dockerfile        # Portal container configuration
├── docker-compose.yml    # Multi-container orchestration
└── README.md            # Project documentation
```

### Service Architecture
The system consists of two main services:

1. **Admin Dashboard (Port 3000)**
   - Built using Homepage (ghcr.io/gethomepage/homepage)
   - Serves as the administrative interface
   - Accessible at `http://192.168.50.92:3000`

2. **User Portal (Port 3001)**
   - Custom Express.js application
   - Serves the user-facing interface
   - Accessible at `http://192.168.50.92:3001`

### Docker Container Setup
The system uses Docker Compose for container orchestration with two main services:

```yaml
services:
  homepage:
    image: ghcr.io/gethomepage/homepage:latest
    ports:
      - "3000:3000"
    volumes:
      - ./config:/app/config
    environment:
      - HOMEPAGE_VAR_TITLE=VaderFlix Dashboard
      - HOMEPAGE_ALLOWED_HOSTS=192.168.50.92:3000

  vader-portal:
    build: ./portal
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
```

## 2. User Portal Details

### Express.js Application Structure
The portal is a lightweight Express.js application with the following structure:

```javascript
const express = require('express');
const path = require('path');
const app = express();

// Static file serving
app.use(express.static('public'));

// Single-page application routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
```

### Overseerr Integration
The portal currently embeds Overseerr through an iframe in the main interface:

```html
<main>
    <iframe src="http://192.168.50.92:5055" frameborder="0"></iframe>
</main>
```

### Imperial Theming
The portal uses custom styling with the Orbitron font family for a Star Wars-inspired theme:

```html
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
```

## 3. Configuration & Environment

### Environment Variables
Key environment variables are managed through Docker Compose:
- `NODE_ENV`: Set to 'production' for the portal
- `HOMEPAGE_VAR_TITLE`: Dashboard title
- `HOMEPAGE_ALLOWED_HOSTS`: Access control for the dashboard

### Service Communication
- The portal communicates with Overseerr through iframe embedding
- Direct API communication is not currently implemented
- Services are isolated in separate containers

## 4. Current User Flow

### Access Flow
1. Users access the portal at `http://192.168.50.92:3001`
2. The portal serves a single-page application
3. Overseerr interface is embedded for content management
4. No current authentication system is implemented

### User Capabilities
- View and interact with Overseerr interface
- Request new content through Overseerr
- Browse available media
- No user-specific state management currently implemented

## 5. Deployment Pipeline

### Container Management
- Containers are configured to restart automatically unless stopped manually
- Logging is configured with rotation (10MB max size, 3 files)
- Security options are enabled to prevent privilege escalation

### Build Process
The portal container is built from source:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## Future Development Considerations

### Planned Improvements
1. **User Access Management**
   - Implementation of lightweight authentication
   - User session handling
   - Access control for different user roles

2. **Enhanced Integration**
   - Direct API communication with Overseerr
   - Custom request handling
   - User preference management

3. **Security Enhancements**
   - HTTPS implementation
   - API key management
   - Rate limiting

### Development Guidelines
1. Maintain container isolation
2. Follow Express.js best practices
3. Implement proper error handling
4. Add comprehensive logging
5. Consider implementing a proper build pipeline

## Getting Started

1. Clone the repository
2. Configure environment variables
3. Run `docker-compose up -d`
4. Access the admin dashboard at port 3000
5. Access the user portal at port 3001

## Contributing

When contributing to this project:
1. Follow the existing architecture patterns
2. Maintain container isolation
3. Document new features and changes
4. Test changes in a development environment
5. Update this architecture document as needed 