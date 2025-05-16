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

# Define Docker paths
DOCKER_PATH="/usr/local/bin/docker"
COMPOSE_PATH="/usr/local/bin/docker-compose"

log "Using configuration:"
log "- NAS IP: $NAS_IP"
log "- NAS User: $NAS_USER"
log "- NAS SSH Port: $NAS_SSH_PORT"
log "- Project Path: $NAS_PROJECT_PATH"
log "- Expected Docker Compose File: $BACKEND_DOCKER_COMPOSE_FILE"

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

# Look for Docker Compose files in the backend directory and project root
log "Scanning for Docker Compose files..."
SSH_OUTPUT=$(ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "find $NAS_PROJECT_PATH $NAS_PROJECT_PATH/backend -name \"*docker-compose*.yml\" -o -name \"*compose*.yml\" 2>/dev/null || echo 'No compose files found'")
log "Found compose files: $SSH_OUTPUT"

# Parse the output to find compose files
if [[ "$SSH_OUTPUT" == *"No compose files found"* ]]; then
  log "No Docker Compose files found in project directories"
  
  # Check if there's a docker-compose.yml file with a different name
  log "Looking for other YAML files that might be compose files..."
  SSH_OUTPUT=$(ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "find $NAS_PROJECT_PATH $NAS_PROJECT_PATH/backend -name \"*.yml\" -o -name \"*.yaml\" 2>/dev/null || echo 'No YAML files found'")
  log "Found YAML files: $SSH_OUTPUT"
  
  if [[ "$SSH_OUTPUT" == *"No YAML files found"* ]]; then
    log "ERROR: No YAML files found in project directories"
    echo "ERROR: No Docker Compose files found. See log for details."
    exit 1
  fi
fi

# Try to determine the best compose file to use
COMPOSE_FILES=($SSH_OUTPUT)
if [ ${#COMPOSE_FILES[@]} -eq 0 ]; then
  log "ERROR: No compose files found"
  echo "ERROR: No compose files found. See log for details."
  exit 1
fi

# Default to the first file found
COMPOSE_FILE=${COMPOSE_FILES[0]}

# But prefer one with 'backend' in the path if available
for file in "${COMPOSE_FILES[@]}"; do
  if [[ "$file" == *"backend"* ]]; then
    COMPOSE_FILE=$file
    break
  fi
done

log "Selected compose file: $COMPOSE_FILE"
echo "Using compose file: $COMPOSE_FILE"

# Stop containers
log "Stopping containers..."
STOP_OUTPUT=$(ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "cd $(dirname "$COMPOSE_FILE") && ${CMD_PREFIX}$COMPOSE_PATH down" 2>&1)
STOP_STATUS=$?
log "Stop command exit code: $STOP_STATUS"
log "Stop command output: $STOP_OUTPUT"

if [ $STOP_STATUS -ne 0 ]; then
  log "Warning: Error stopping containers. Will attempt to start anyway."
  echo "Warning: Error stopping containers. Will attempt to start anyway."
fi

# Start containers
log "Starting containers..."
START_OUTPUT=$(ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "cd $(dirname "$COMPOSE_FILE") && ${CMD_PREFIX}$COMPOSE_PATH up -d" 2>&1)
START_STATUS=$?
log "Start command exit code: $START_STATUS"
log "Start command output: $START_OUTPUT"

if [ $START_STATUS -ne 0 ]; then
  log "ERROR: Failed to start containers"
  echo "ERROR: Failed to start containers. See log for details."
  exit 1
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