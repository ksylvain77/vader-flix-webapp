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

# Execute commands directly on the NAS by PIPING them to bash over SSH
log "Executing Docker commands on NAS..."

ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP << 'EOF'
# These commands will run on the NAS
echo "Stopping backend containers..."
cd /volume1/docker/projects/vader-flix-webapp/backend
sudo /usr/local/bin/docker-compose -f compose.yaml down

echo "Starting backend containers..."
cd /volume1/docker/projects/vader-flix-webapp/backend
sudo /usr/local/bin/docker-compose -f compose.yaml up -d

echo "Stopping db containers..."
cd /volume1/docker/projects/vader-flix-webapp/db
sudo /usr/local/bin/docker-compose -f compose.yaml down

echo "Starting db containers..."
cd /volume1/docker/projects/vader-flix-webapp/db
sudo /usr/local/bin/docker-compose -f compose.yaml up -d
EOF

STATUS=$?
if [ $STATUS -ne 0 ]; then
  log "ERROR: Failed to execute Docker commands"
  echo "ERROR: Failed to execute Docker commands. See log for details."
  exit 1
fi

log "Commands executed at $(date)"
echo "Commands executed at $(date)"

log "Waiting 30 seconds for containers to restart..."
echo "Waiting 30 seconds for containers to restart..."
sleep 30

# Check container status using a separate SSH command
log "Checking container status..."
RUNNING_CONTAINERS=$(ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "sudo /usr/local/bin/docker ps --filter \"name=$CONTAINER_NAME_PREFIX\" --format \"{{.Names}}: {{.Status}}\"" 2>&1)
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