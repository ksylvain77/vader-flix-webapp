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

# Run the commands directly through SSH on the NAS
log "Executing Docker commands on NAS..."

log "Stopping backend containers..."
ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "echo 'Stopping backend containers...'" >> $LOG_FILE
ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "cd $NAS_PROJECT_PATH/backend && sudo /usr/local/bin/docker-compose -f compose.yaml down" >> $LOG_FILE 2>&1

log "Starting backend containers..."
ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "echo 'Starting backend containers...'" >> $LOG_FILE
ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "cd $NAS_PROJECT_PATH/backend && sudo /usr/local/bin/docker-compose -f compose.yaml up -d" >> $LOG_FILE 2>&1

log "Stopping db containers..."
ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "echo 'Stopping db containers...'" >> $LOG_FILE
ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "cd $NAS_PROJECT_PATH/db && sudo /usr/local/bin/docker-compose -f compose.yaml down" >> $LOG_FILE 2>&1

log "Starting db containers..."
ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "echo 'Starting db containers...'" >> $LOG_FILE
ssh -p $NAS_SSH_PORT $NAS_USER@$NAS_IP "cd $NAS_PROJECT_PATH/db && sudo /usr/local/bin/docker-compose -f com