#!/bin/bash

# Restart Vader Flix Docker containers
# Run this script after pushing changes to Docker-controlled files

echo "Stopping vader-flix containers..."
cd /volume1/docker/projects/vader-flix-webapp
docker-compose down

echo "Starting vader-flix containers..."
docker-compose up -d

echo "Containers restarted at $(date)"