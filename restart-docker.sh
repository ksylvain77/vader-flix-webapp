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
log "- Container Name Prefix: $CONTAINER_NAME_PREFIX"

# Define Docker command with sudo
DOCKER_CMD="sudo docker"

# Record the start time
START_TIME=$(date +%s)

# Define the specific container names from what we observed
DB_CONTAINER="mariadb"
BACKEND_CONTAINER="vader-flix-backend"
FRONTEND_CONTAINER="vader-flix-frontend"

log "Using specific container names:"
log "- Database: $DB_CONTAINER"
log "- Backend: $BACKEND_CONTAINER"
log "- Frontend: $FRONTEND_CONTAINER"

# Function to restart a container
restart_container() {
  local container_name=$1
  
  log "Restarting container: $container_name"
  
  RESTART_RESULT=$(ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "$DOCKER_CMD restart $container_name" 2>&1)
  RESTART_STATUS=$?
  
  log "Restart result: $RESTART_RESULT"
  
  if [ $RESTART_STATUS -ne 0 ]; then
    log "ERROR: Failed to restart container: $container_name"
    return 1
  fi
  
  log "Container restarted successfully: $container_name"
  return 0
}

# Restart containers in correct order: database first, then backend, then frontend
log "Starting container restarts in sequence..."

# Restart database
restart_container "$DB_CONTAINER"
DB_STATUS=$?
  
# Wait for database to initialize if restart was successful
if [ $DB_STATUS -eq 0 ]; then
  log "Waiting for database to initialize..."
  sleep 10
else
  log "ERROR: Failed to restart database container"
  exit 1
fi

# Restart backend
restart_container "$BACKEND_CONTAINER"
BACKEND_STATUS=$?
  
# Wait for backend to initialize if restart was successful
if [ $BACKEND_STATUS -eq 0 ]; then
  log "Waiting for backend to initialize..."
  sleep 5
else
  log "ERROR: Failed to restart backend container"
  exit 1
fi

# Restart frontend
restart_container "$FRONTEND_CONTAINER"
FRONTEND_STATUS=$?

if [ $FRONTEND_STATUS -ne 0 ]; then
  log "ERROR: Failed to restart frontend container"
  exit 1
fi

# Wait a short time before starting to check
echo "Waiting for containers to start..."
sleep 5

# Poll to check when the containers are up
MAX_WAIT=45 # Maximum wait time in seconds
WAIT_STEP=5 # Check every 5 seconds
for (( elapsed=5; elapsed<=$MAX_WAIT; elapsed+=$WAIT_STEP )); do
  log "Checking container status after $elapsed seconds..."
  
  # Check all required ports
  BACKEND_CHECK=$(ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "netstat -an | grep LISTEN | grep :3000" 2>&1)
  FRONTEND_CHECK=$(ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "netstat -an | grep LISTEN | grep :3001" 2>&1)
  DB_CHECK=$(ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "netstat -an | grep LISTEN | grep :3306" 2>&1)
  
  # If we see all ports open, containers are running
  if [ -n "$BACKEND_CHECK" ] && [ -n "$FRONTEND_CHECK" ] && [ -n "$DB_CHECK" ]; then
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))
    log "All containers started successfully after $DURATION seconds"
    echo "All containers started successfully after $DURATION seconds"
    
    # Get actual container status for verification
    CONTAINER_STATUS=$(ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "$DOCKER_CMD ps --filter name=${CONTAINER_NAME_PREFIX}" 2>&1)
    log "Container status:"
    log "$CONTAINER_STATUS"
    
    log "========== Script completed at $(date) =========="
    exit 0
  fi
  
  log "Containers not yet ready, continuing to wait..."
  sleep $WAIT_STEP
done

# If we get here, we timed out
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
log "WARNING: Reached maximum wait time ($MAX_WAIT seconds)"
log "Actual elapsed time: $DURATION seconds"

# Get actual container status for debugging
CONTAINER_STATUS=$(ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "$DOCKER_CMD ps --filter name=${CONTAINER_NAME_PREFIX}" 2>&1)
log "Container status at timeout:"
log "$CONTAINER_STATUS"

echo "WARNING: Reached maximum wait time ($MAX_WAIT seconds)"
echo "Container status unknown. To check container status, SSH into the NAS and run: sudo docker ps"
log "========== Script completed at $(date) =========="