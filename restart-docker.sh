#!/bin/bash

# Source the config file
source ./project.config

# Set up logging
LOG_FILE="vader-flix-restart.log"
echo "========== Restart attempt at $(date) ==========" > $LOG_FILE

# Log function
log() {
  echo "$1" | tee -a $LOG_FILE
}

log "Using configuration:"
log "- NAS IP: $NAS_IP"
log "- NAS User: $NAS_USER"
log "- NAS SSH Port: $NAS_SSH_PORT"
log "- Project Path: $NAS_PROJECT_PATH"
log "- Container Prefix: $CONTAINER_NAME_PREFIX"

# Define full paths to Docker executables
DOCKER_CMD="/usr/local/bin/docker"
COMPOSE_CMD="/usr/local/bin/docker-compose"

# Restart backend containers
log "Stopping backend containers..."
STOP_BACKEND=$(ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "cd $NAS_PROJECT_PATH/backend && $COMPOSE_CMD -f compose.yaml down" 2>&1)
log "Backend stop output: $STOP_BACKEND"

log "Starting backend containers..."
START_BACKEND=$(ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "cd $NAS_PROJECT_PATH/backend && $COMPOSE_CMD -f compose.yaml up -d" 2>&1)
BACKEND_STATUS=$?
log "Backend start output: $START_BACKEND"
log "Backend start status: $BACKEND_STATUS"

# Restart db containers
log "Stopping db containers..."
STOP_DB=$(ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "cd $NAS_PROJECT_PATH/db && $COMPOSE_CMD -f compose.yaml down" 2>&1)
log "DB stop output: $STOP_DB"

log "Starting db containers..."
START_DB=$(ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "cd $NAS_PROJECT_PATH/db && $COMPOSE_CMD -f compose.yaml up -d" 2>&1)
DB_STATUS=$?
log "DB start output: $START_DB"
log "DB start status: $DB_STATUS"

log "Containers restarted at $(date)"
echo "Containers restarted at $(date)"

log "Waiting 10 seconds for containers to start..."
echo "Waiting 10 seconds for containers to start..."
sleep 10

# Check container status
log "Checking container status..."
RUNNING_CONTAINERS=$(ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "$DOCKER_CMD ps --filter \"name=$CONTAINER_NAME_PREFIX\" --format \"{{.Names}}: {{.Status}}\"" 2>&1)
CONTAINER_STATUS=$?

log "Container status check exit code: $CONTAINER_STATUS"
log "Running containers: $RUNNING_CONTAINERS"

if [ $CONTAINER_STATUS -ne 0 ]; then
  log "ERROR: Failed to get container status"
  echo "ERROR: Failed to get container status. See log for details."
  exit 1
fi

if [ -n "$RUNNING_CONTAINERS" ]; then
  log "SUCCESS: Containers are up and running"
  echo -e "\nContainers are up and running:"
  echo "$RUNNING_CONTAINERS"
  echo "All $CONTAINER_NAME_PREFIX containers appear to be running."
else
  log "WARNING: No $CONTAINER_NAME_PREFIX containers are currently running!"
  echo -e "\nWarning: No $CONTAINER_NAME_PREFIX containers are currently running!"
fi

log "========== Script completed at $(date) =========="