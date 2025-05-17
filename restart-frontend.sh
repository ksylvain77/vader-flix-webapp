#!/bin/bash

# Source the config file
source ./project.config

# Use full paths for Docker binaries
DOCKER="/usr/local/bin/docker"
DOCKER_COMPOSE="/usr/local/bin/docker-compose"

# Log file
LOG_FILE="frontend-restart.log"
echo "========== Frontend restart attempt at $(date) ==========" > $LOG_FILE

log() {
  echo "$1" | tee -a $LOG_FILE
}

FRONTEND_CONTAINER="vader-flix-frontend"
FRONTEND_COMPOSE_PATH="$NAS_PROJECT_PATH/frontend"

log "Stopping frontend container..."
ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "$DOCKER stop $FRONTEND_CONTAINER"

log "Removing frontend container..."
ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "$DOCKER rm $FRONTEND_CONTAINER"

log "Starting frontend container with docker-compose..."
ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "cd $FRONTEND_COMPOSE_PATH && $DOCKER_COMPOSE up -d"

log "Checking frontend container status..."
ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "$DOCKER ps | grep $FRONTEND_CONTAINER" | tee -a $LOG_FILE

log "========== Frontend restart completed at $(date) ==========" 