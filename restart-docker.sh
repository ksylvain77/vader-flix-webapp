#!/bin/bash
# Simple Docker restart script for Synology NAS

# Log file
LOG_FILE="vader-flix-restart.log"
echo "========== Restart attempt at $(date) ==========" > $LOG_FILE

# Log function
log() {
  echo "$1" | tee -a $LOG_FILE
}

log "Starting container restarts at $(date)"

# Restart containers in proper order
log "Restarting database container..."
docker restart mariadb
sleep 10

log "Restarting backend container..."
docker restart vader-flix-backend
sleep 5

log "Restarting frontend container..."
docker restart vader-flix-frontend

log "All containers restarted at $(date)"

# Check if containers are running
log "Checking container status..."
docker ps --filter name=vader-flix