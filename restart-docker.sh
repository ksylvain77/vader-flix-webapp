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

# Record the start time
START_TIME=$(date +%s)

# Use the Synology API to restart containers
log "Restarting mariadb container..."
ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "synowebapi --exec api=SYNO.Docker.Container version=1 method=restart name=\"mariadb\""
log "Waiting for database to initialize..."
sleep 10

log "Restarting backend container..."
ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "synowebapi --exec api=SYNO.Docker.Container version=1 method=restart name=\"vader-flix-backend\""
log "Waiting for backend to initialize..."
sleep 5

log "Restarting frontend container..."
ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "synowebapi --exec api=SYNO.Docker.Container version=1 method=restart name=\"vader-flix-frontend\""

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
    CONTAINER_STATUS=$(ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "synowebapi --exec api=SYNO.Docker.Container version=1 method=list" 2>&1)
    log "Container status check completed"
    
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
CONTAINER_STATUS=$(ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "synowebapi --exec api=SYNO.Docker.Container version=1 method=list" 2>&1)
log "Container status check completed"

echo "WARNING: Reached maximum wait time ($MAX_WAIT seconds)"
echo "Container status unknown. Check the log file for details."
log "========== Script completed at $(date) =========="