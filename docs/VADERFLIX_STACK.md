
# VADERFLIX Full Stack Overview

This document outlines the structure, tools, and service integration for the VaderFlix full-stack media management system.

---

## Frontend Stack

- **React**: Core UI library
- **Axios**: For API requests (Sonarr, Radarr, Plex, etc.)
- **Vite**: Frontend dev/build tooling
- **Webpack**: Possibly used in backend/proxy tooling
- **No centralized state management** (e.g., Redux, Zustand)
- **No UI framework** currently in use (e.g., MUI, Tailwind)

---

## Backend Stack

- **Express**: Primary HTTP framework
- **WebSocket**: Real-time server support (`websocket-test-server.js`)
- **Modular architecture**: Organized into `routes/`, `controllers/`, `services/`, `middleware/`
- **MariaDB**: Primary database, running via Synology
- **Sequelize**: ORM for DB communication
- **CORS**: Middleware confirmed
- **JWT**: Used for authentication and route protection

---

## Integrated Services

- **Sonarr** – Fully integrated and operational (search endpoint confirmed working)
- **Radarr** – Configured with API key, URL, and root folders; considered wired up
- **Plex** – Successfully connected; Plex library is visible in UI
- **qBittorrent** – Not yet wired in
- **Recyclarr** – Not started
- **Prowlarr** – Part of the stack but not yet integrated
- **Docker Container Manager (Synology)** – Used to host and manage all service containers

---

## System Execution & Hosting

- **Container Manager (Synology)** is used to create and host all core services
- **Multiple `docker-compose.yaml` files** are used at the project level to group and configure services
- **Restarting the stack** is handled via a custom shell script:
  - Brings down and restarts: database → backend → frontend
- **No reverse proxy is currently configured**
- **Local IP routing** is used for services:
  - Plex, Sonarr, Radarr accessed via `192.168.50.92`
  - qBittorrent and Gluetun run in isolated containers behind VPN
