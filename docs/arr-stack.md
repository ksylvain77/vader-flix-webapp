# *arr Stack Setup

This document details the setup and configuration of the media management stack used with VaderFlix.

## 🎬 Overview

The *arr stack consists of several applications working together to manage your media collection:

- **Radarr**: Movie management and automation
- **Sonarr**: TV show management and automation
- **Prowlarr**: Indexer management
- **Overseer**: Media request management
- **Flare Solver**: Anti-bot protection

## 🏗️ Architecture

### Container Setup
All services are containerized using Docker and managed through a single docker-compose file. Each service runs in its own container but shares the same Docker network (`synobridge`).

### Port Configuration
- **Radarr**: 7878
- **Sonarr**: 8989
- **Prowlarr**: 9696
- **Overseer**: 5055
- **Flare Solver**: 8191

## 🔧 Configuration

### Docker Compose
```yaml
version: "3.8"

services:
  sonarr:
    image: linuxserver/sonarr:latest
    container_name: sonarr
    environment:
      - PUID=1027
      - PGID=65536
      - TZ=America/New_York
    volumes:
      - /volume1/docker/sonarr:/config
      - /volume1/data:/data
    ports:
      - 8989:8989
    networks:
      - synobridge
    restart: unless-stopped

  radarr:
    image: linuxserver/radarr:latest
    container_name: radarr
    environment:
      - PUID=1027
      - PGID=65536
      - TZ=America/New_York
    volumes:
      - /volume1/docker/radarr:/config
      - /volume1/data:/data
    ports:
      - 7878:7878
    networks:
      - synobridge
    restart: unless-stopped

  prowlarr:
    image: linuxserver/prowlarr:latest
    container_name: prowlarr
    environment:
      - PUID=1027
      - PGID=65536
      - TZ=America/New_York
    volumes:
      - /volume1/docker/prowlarr:/config
    ports:
      - 9696:9696
    networks:
      - synobridge
    restart: unless-stopped

  flaresolverr:
    image: ghcr.io/flaresolverr/flaresolverr:latest
    container_name: flaresolverr
    environment:
      - LOG_LEVEL=info
    ports:
      - 8191:8191
    networks:
      - synobridge
    restart: unless-stopped

  overseerr:
    image: sctx/overseerr:latest
    container_name: overseerr
    environment:
      - PUID=1027
      - PGID=65536
      - TZ=America/New_York
    volumes:
      - /volume1/docker/overseerr:/app/config
    ports:
      - 5055:5055
    networks:
      - synobridge
    restart: unless-stopped

networks:
  synobridge:
    external: true
```

### Volume Structure
- All services store their configuration in `/volume1/docker/<service-name>`
- Media data is stored in `/volume1/data`
- Each service maintains its own configuration directory

### Network Configuration
- All services are connected through the `synobridge` network
- This network is external and shared with the VaderFlix webapp
- Port forwarding is required for external access to Overseer (5055)

## 🔒 Security

### Access Control
- Each service has its own authentication system
- Overseer is integrated with VaderFlix for user management
- Port forwarding should be configured securely

### Best Practices
1. Use strong passwords for each service
2. Configure proper firewall rules
3. Keep services updated regularly
4. Monitor logs for suspicious activity

## 🔄 Integration with VaderFlix

### Overseer Integration
- Overseer is accessible through VaderFlix Portal
- Port 5055 must be forwarded for external access
- Users authenticate through VaderFlix before accessing Overseer

### Service Communication
- All services communicate through the `synobridge` network
- Prowlarr provides indexers to Radarr and Sonarr
- Flare Solver helps with anti-bot protection

## 📝 Maintenance

### Updates
- Services can be updated by pulling new images
- Configuration is preserved through volume mounting
- Regular backups of configuration directories recommended

### Logs
- Each service maintains its own logs
- Logs are stored in respective configuration directories
- Monitor logs for errors and performance issues

## 🔍 Troubleshooting

### Common Issues
1. **Service Unavailable**
   - Check if container is running
   - Verify port forwarding
   - Check network connectivity

2. **Authentication Issues**
   - Verify credentials
   - Check service logs
   - Ensure proper network access

3. **Integration Problems**
   - Verify network connectivity
   - Check service configurations
   - Ensure proper port forwarding

## 📚 Resources

- [Radarr Documentation](https://wiki.servarr.com/radarr)
- [Sonarr Documentation](https://wiki.servarr.com/sonarr)
- [Prowlarr Documentation](https://wiki.servarr.com/prowlarr)
- [Overseer Documentation](https://docs.overseerr.dev/)
- [Flare Solver Documentation](https://github.com/FlareSolverr/FlareSolverr) 