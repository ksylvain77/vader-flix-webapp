# Troubleshooting Guide

Common issues and their solutions for VaderFlix.

## Services Won't Start

### Check Docker Status
```bash
docker-compose ps
```

### Check Logs
```bash
docker-compose logs
```

## Homepage Dashboard Issues

### Can't Access Dashboard
1. Check if the service is running: `docker-compose ps homepage`
2. Verify port 3000 is not in use: `lsof -i :3000`
3. Check network settings in docker-compose.yml

### Configuration Not Loading
1. Verify config directory exists: `ls -la ./config`
2. Check permissions: `ls -la ./config`
3. Restart the container: `docker-compose restart homepage`

## VaderFlix Portal Issues

### Can't Access Portal
1. Check if the service is running: `docker-compose ps vader-portal`
2. Verify port 3001 is not in use: `lsof -i :3001`
3. Check logs: `docker-compose logs vader-portal`

### Data Persistence Issues
1. Check portal-data directory: `ls -la ./portal-data`
2. Verify permissions: `ls -la ./portal-data`
3. Restart the container: `docker-compose restart vader-portal`

## Common Fixes

### Reset Everything
```bash
docker-compose down
docker-compose up -d
```

### Clear Logs
```bash
docker-compose down
rm -rf ./logs/*
docker-compose up -d
```

### Check Network
```bash
docker network ls
docker network inspect synobridge
``` 