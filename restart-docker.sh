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

# Record the start time
START_TIME=$(date +%s)

# Run the task via synoschedtask
log "Triggering Docker restart task..."
TASK_RESULT=$(ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "/usr/syno/bin/synoschedtask --run id=3" 2>&1)
TASK_STATUS=$?

log "Task trigger result: $TASK_RESULT"
log "Task trigger status code: $TASK_STATUS"

if [ $TASK_STATUS -ne 0 ]; then
  log "ERROR: Failed to trigger task"
  echo "ERROR: Failed to trigger task. See log for details."
  exit 1
fi

log "Task triggered successfully at $(date)"
echo "Task triggered successfully at $(date)"

# Poll to check when the container is up
echo "Waiting for containers to start..."
MAX_WAIT=30  # Maximum wait time in seconds
WAIT_STEP=5  # Check every 5 seconds

for (( elapsed=0; elapsed<=$MAX_WAIT; elapsed+=$WAIT_STEP )); do
  # Sleep first to give it time to start
  sleep $WAIT_STEP
  log "Checking container status after $elapsed seconds..."
  
  # We'll use a trick to check status without needing sudo password
  # Use a "quiet" docker API query that just counts containers
  CONTAINER_COUNT=$(ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "curl -s --unix-socket /var/run/docker.sock http:/v1.24/containers/json?filters=\{%22name%22:\{%22vader-flix%22:true\}\} | grep -o '\"Id\"' | wc -l" 2>/dev/null)
  
  # If error or zero containers, continue waiting
  if [ -z "$CONTAINER_COUNT" ] || [ "$CONTAINER_COUNT" -eq 0 ]; then
    log "Containers not yet ready, continuing to wait..."
    continue
  fi
  
  # If we get here, containers are running
  END_TIME=$(date +%s)
  DURATION=$((END_TIME - START_TIME))
  log "Containers started successfully after $DURATION seconds"
  echo "Containers started successfully after $DURATION seconds"
  log "========== Script completed at $(date) =========="
  exit 0
done

# If we get here, we timed out
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
log "WARNING: Reached maximum wait time ($MAX_WAIT seconds)"
log "Actual elapsed time: $DURATION seconds"
echo "WARNING: Reached maximum wait time ($MAX_WAIT seconds)"
echo "Container status unknown. To check container status, SSH into the NAS and run: sudo docker ps --filter name=vader-flix"

log "========== Script completed at $(date) =========="