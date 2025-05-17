#!/bin/bash

# Source the config file
source ./project.config

# Use full paths for Docker binaries
DOCKER="/usr/local/bin/docker"
DOCKER_COMPOSE="/usr/local/bin/docker-compose"

# Log file
LOG_FILE="backend-restart.log"
echo "========== Backend restart attempt at $(date) ==========" > $LOG_FILE

# Log function
log() {
  echo "$1" | tee -a $LOG_FILE
}

# Container name
BACKEND_CONTAINER="vader-flix-backend"
BACKEND_COMPOSE_PATH="$NAS_PROJECT_PATH/backend"

log "Starting backend restart process..."

# Stop the backend container
log "Stopping backend container..."
ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "$DOCKER stop $BACKEND_CONTAINER"
sleep 2

# Remove the container to ensure clean state
log "Removing backend container..."
ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "$DOCKER rm $BACKEND_CONTAINER"
sleep 2

# Start the backend container
log "Starting backend container with docker-compose..."
ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "cd $BACKEND_COMPOSE_PATH && $DOCKER_COMPOSE up -d"

# Wait for the container to start
sleep 5

# Check if the container is running
CONTAINER_STATUS=$(ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "$DOCKER ps | grep $BACKEND_CONTAINER")
if [ -n "$CONTAINER_STATUS" ]; then
    log "Backend container is running successfully"
    log "Container details:"
    log "$CONTAINER_STATUS"
else
    log "ERROR: Backend container failed to start"
    exit 1
fi

log "========== Backend restart completed at $(date) ==========" 