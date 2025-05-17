# Container and Network Investigation

## Running Containers (as of May 17, 2025)
```
CONTAINER ID   IMAGE                         COMMAND                  CREATED         STATUS         PORTS                                       NAMES
7f0c79098a3b   node:16                       "docker-entrypoint.s…"   6 minutes ago   Up 6 minutes   0.0.0.0:3001->3000/tcp, :::3001->3000/tcp   vader-flix-frontend
89f806c40328   node:16                       "docker-entrypoint.s…"   6 minutes ago   Up 6 minutes   0.0.0.0:3000->3000/tcp, :::3000->3000/tcp   vader-flix-backend
5c5b1bfd903e   mariadb:11.4                  "docker-entrypoint.s…"   6 minutes ago   Up 6 minutes   0.0.0.0:3306->3306/tcp, :::3306->3306/tcp   mariadb
3d533902f399   linuxserver/plex:latest       "/init"                  2 days ago      Up 3 hours                                                 plex
12ea7d3c17e2   linuxserver/sonarr:latest     "/init"                  2 days ago      Up 3 hours     0.0.0.0:8989->8989/tcp, :::8989->8989/tcp   sonarr
f3e34803dc83   linuxserver/radarr:latest     "/init"                  2 days ago      Up 3 hours     0.0.0.0:7878->7878/tcp, :::7878->7878/tcp   radarr
02ce638b68b8   linuxserver/lidarr:latest     "/init"                  2 days ago      Up 3 hours     0.0.0.0:8686->8686/tcp, :::8686->8686/tcp   lidarr
13dabe45f1f7   linuxserver/readarr:develop   "/init"                  2 days ago      Up 3 hours     0.0.0.0:8787->8787/tcp, :::8787->8787/tcp   readarr
1e4cdc1f9acf   linuxserver/bazarr:latest     "/init"                  2 days ago      Up 3 hours     0.0.0.0:6767->6767/tcp, :::6767->6767/tcp   bazarr
```

## Available Networks
```
NETWORK ID     NAME                          DRIVER    SCOPE
f2d394ce1ee6   backend_default               bridge    local
221f0a2108ca   bridge                        bridge    local
3df050c4c3ac   db_default                    bridge    local
15b15d272cdd   frontend_default              bridge    local
a43dfaf01ed9   host                          host      local
4d50e1ab6941   mariadb_default               bridge    local
4e769bd7817e   none                          null      local
0bcfa3dfb582   synobridge                    bridge    local
1598cb07fe10   vader-flix-frontend_default   bridge    local
ea8142b04b67   vader-flix-project_default    bridge    local
```

## Synobridge Network Details
- Network ID: 0bcfa3dfb582
- Subnet: 172.20.0.0/16
- Gateway: 172.20.0.1
- Connected Containers:
  - lidarr (172.20.0.4)
  - sonarr (172.20.0.2)
  - readarr (172.20.0.5)
  - bazarr (172.20.0.3)
  - radarr (172.20.0.7)

## Backend Container Network Details
- Connected to: backend_default
- Network ID: f2d394ce1ee6
- IP Address: 172.23.0.2
- Gateway: 172.23.0.1
- Aliases: vader-flix-backend, backend

## MariaDB Container Network Details
- Connected to: db_default
- Network ID: 3df050c4c3ac
- IP Address: 172.24.0.2
- Gateway: 172.24.0.1
- Aliases: mariadb, mariadb

## Frontend Container Network Details
- Connected to: frontend_default
- Network ID: 15b15d272cdd
- IP Address: 192.168.0.2
- Gateway: 192.168.0.1
- Aliases: vader-flix-frontend, frontend

## Key Observations
1. All three main containers (frontend, backend, mariadb) are running
2. Ports are properly mapped:
   - Frontend: 3001->3000
   - Backend: 3000->3000
   - MariaDB: 3306->3306
3. The `synobridge` network exists and is used by the *arr containers
4. Our Vader Flix containers are on separate networks:
   - Backend is on `backend_default` (172.23.0.2)
   - MariaDB is on `db_default` (172.24.0.2)
   - Frontend is on `frontend_default` (192.168.0.2)
5. **Critical Issue**: The backend container cannot reach the database because they are on different networks (172.23.0.0/16 vs 172.24.0.0/16)
6. **Additional Issue**: The frontend is on a completely different subnet (192.168.0.0/20) from both the backend and database

## Next Steps
1. Review all findings
2. Discuss potential solutions:
   - Option 1: Connect all containers to the same network
   - Option 2: Connect backend and database to the same network
   - Option 3: Use the host network for all containers
3. Consider the impact of each solution on:
   - Container communication
   - Security
   - Network isolation
   - Existing *arr containers on synobridge 