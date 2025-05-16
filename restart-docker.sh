#!/bin/bash

# Restart Vader Flix Docker containers
# Run this script after pushing changes to Docker-controlled files

echo "Stopping vader-flix containers..."
cd /volume1/docker/projects/vader-flix-webapp
docker-compose down

echo "Starting vader-flix containers..."
docker-compose up -d

echo "Containers restarted at $(date)"

echo "Waiting 10 seconds for containers to start..."
sleep 10

echo "Checking container status..."
RUNNING_CONTAINERS=$(docker ps --filter "name=vader-flix" --format "{{.Names}}: {{.Status}}")
if [ -n "$RUNNING_CONTAINERS" ]; then
  echo "\nContainers are up and running:"
  echo "$RUNNING_CONTAINERS"
  echo "All vader-flix containers appear to be running."
else
  echo "\nWarning: No vader-flix containers are currently running!"
fi