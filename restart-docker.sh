#!/bin/bash
# Simple Docker restart script for Synology NAS

# Set environment variable for Docker socket
export DOCKER_HOST="unix:///var/run/docker.sock"

# Log file
LOG_FILE="vader-flix-restart.log"
echo "========== Restart attempt at $(date) ==========" > $LOG_FILE

# Log function
log() {
  echo "$1" | tee -a $LOG_FILE
}

log "Starting container restarts at $(date)"

# Test Docker connection first
if ! docker ps > /dev/null 2>&1; then
  log "ERROR: Cannot connect to Docker daemon. Trying to restart Docker service..."
  sudo synoservicecfg --restart pkgctl-Docker
  sleep 5
  
  # Check again after restart
  if ! docker ps > /dev/null 2>&1; then
    log "ERROR: Still cannot connect to Docker daemon after service restart."
    echo "ERROR: Docker daemon connection failed. See log for details."
    exit 1
  fi
fi

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