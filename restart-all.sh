#!/bin/bash

# Source the config file
source ./project.config

# Use full paths for Docker binaries
DOCKER="/usr/local/bin/docker"
DOCKER_COMPOSE="/usr/local/bin/docker-compose"

# Log file
LOG_FILE="restart-all.log"
echo "========== Restart all containers attempt at $(date) ==========" > $LOG_FILE

log() {
  echo "$1" | tee -a $LOG_FILE
}

# Database
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

# Backend
BACKEND_CONTAINER="vader-flix-backend"
BACKEND_COMPOSE_PATH="$NAS_PROJECT_PATH/backend"

log "Stopping backend container..."
ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "$DOCKER stop $BACKEND_CONTAINER"

log "Removing backend container..."
ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "$DOCKER rm $BACKEND_CONTAINER"

log "Starting backend container with docker-compose..."
ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "cd $BACKEND_COMPOSE_PATH && $DOCKER_COMPOSE up -d"

log "Checking backend container status..."
ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "$DOCKER ps | grep $BACKEND_CONTAINER" | tee -a $LOG_FILE

# Frontend
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

log "========== Restart all containers completed at $(date) ==========" 