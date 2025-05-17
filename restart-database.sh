#!/bin/bash

# Source the config file
source ./project.config

# Use full paths for Docker binaries
DOCKER="/usr/local/bin/docker"
DOCKER_COMPOSE="/usr/local/bin/docker-compose"

# Log file
LOG_FILE="database-restart.log"
echo "========== Database restart attempt at $(date) ==========" > $LOG_FILE

log() {
  echo "$1" | tee -a $LOG_FILE
}

DB_CONTAINER="mariadb"
DB_COMPOSE_PATH="$NAS_PROJECT_PATH/db"

log "Stopping database container..."
ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "$DOCKER stop $DB_CONTAINER"

log "Removing database container..."
ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "$DOCKER rm $DB_CONTAINER"

log "Starting database container with docker-compose..."
ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "cd $DB_COMPOSE_PATH && $DOCKER_COMPOSE up -d"

log "Checking database container status..."
ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "$DOCKER ps | grep $DB_CONTAINER" | tee -a $LOG_FILE

log "========== Database restart completed at $(date) ==========" 