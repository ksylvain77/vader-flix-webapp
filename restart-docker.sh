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

# Define Docker paths based on Synology NAS
DOCKER_PATH="/usr/local/bin/docker"
COMPOSE_PATH="/usr/local/bin/docker-compose"

log "Using configuration:"
log "- NAS IP: $NAS_IP"
log "- NAS User: $NAS_USER"
log "- NAS SSH Port: $NAS_SSH_PORT"
log "- Project Path: $NAS_PROJECT_PATH"
log "- Container Prefix: $CONTAINER_NAME_PREFIX"

# Check if we need to use sudo for Docker commands
log "Testing Docker access with and without sudo..."
run_with_sudo=false

# Test without sudo
SSH_OUTPUT=$(ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "$DOCKER_PATH ps" 2>&1)
if echo "$SSH_OUTPUT" | grep -q "permission denied"; then
  log "Docker without sudo: Permission denied"
  
  # Test with sudo
  SSH_OUTPUT=$(ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "sudo $DOCKER_PATH ps" 2>&1)
  if ! echo "$SSH_OUTPUT" | grep -q "permission denied"; then
    log "Docker with sudo: Working"
    run_with_sudo=true
  else
    log "Docker with sudo: Still permission denied. User may not have sudo access."
    echo "ERROR: Cannot access Docker even with sudo. Check Docker permissions."
    exit 1
  fi
else
  log "Docker without sudo: Working"
fi

# Set command prefix based on sudo test
if [ "$run_with_sudo" = true ]; then
  CMD_PREFIX="sudo "
else
  CMD_PREFIX=""
fi

log "Using ${CMD_PREFIX}for Docker commands"

# Define both compose files with the correct extension (.yaml instead of .yml)
BACKEND_COMPOSE_FILE="$NAS_PROJECT_PATH/backend/compose.yaml"
DB_COMPOSE_FILE="$NAS_PROJECT_PATH/db/compose.yaml"

# Restart backend containers
log "Stopping backend containers..."
BACKEND_STOP=$(ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "cd $NAS_PROJECT_PATH/backend && ${CMD_PREFIX}$COMPOSE_PATH -f compose.yaml down" 2>&1)
log "Backend stop output: $BACKEND_STOP"

log "Starting backend containers..."
BACKEND_START=$(ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "cd $NAS_PROJECT_PATH/backend && ${CMD_PREFIX}$COMPOSE_PATH -f compose.yaml up -d" 2>&1)
BACKEND_STATUS=$?
log "Backend start output: $BACKEND_START"
log "Backend exit status: $BACKEND_STATUS"

if [ $BACKEND_STATUS -ne 0 ]; then
  log "WARNING: Error starting backend containers"
  echo "WARNING: Error starting backend containers. See log for details."
else
  log "Backend containers started successfully"
  echo "Backend containers started successfully"
fi

# Restart database containers
log "Stopping database containers..."
DB_STOP=$(ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "cd $NAS_PROJECT_PATH/db && ${CMD_PREFIX}$COMPOSE_PATH -f compose.yaml down" 2>&1)
log "Database stop output: $DB_STOP"

log "Starting database containers..."
DB_START=$(ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "cd $NAS_PROJECT_PATH/db && ${CMD_PREFIX}$COMPOSE_PATH -f compose.yaml up -d" 2>&1)
DB_STATUS=$?
log "Database start output: $DB_START"
log "Database exit status: $DB_STATUS"

if [ $DB_STATUS -ne 0 ]; then
  log "WARNING: Error starting database containers"
  echo "WARNING: Error starting database containers. See log for details."
else
  log "Database containers started successfully"
  echo "Database containers started successfully"
fi

log "Containers restarted at $(date)"
echo "Containers restarted at $(date)"

log "Waiting 10 seconds for containers to start..."
echo "Waiting 10 seconds for containers to start..."
sleep 10

# Check container status
log "Checking container status..."
RUNNING_CONTAINERS=$(ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "${CMD_PREFIX}$DOCKER_PATH ps --filter \"name=$CONTAINER_NAME_PREFIX\" --format \"{{.Names}}: {{.Status}}\"" 2>&1)
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