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

log "Waiting 30 seconds for containers to restart..."
echo "Waiting 30 seconds for containers to restart..."
sleep 30

log "Task execution completed"
echo "Task execution completed"
echo "To check container status, SSH into the NAS and run: sudo docker ps --filter name=vader-flix"

log "========== Script completed at $(date) =========="