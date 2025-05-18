#!/bin/bash

# Create a timestamped filename
timestamp=$(date +"%Y-%m-%d_%H-%M-%S")
zipname="vaderflix-checkpoint-$timestamp.zip"

# Create staging directory
mkdir clean-checkpoint

# Copy backend and frontend without node_modules
rsync -av --exclude='node_modules' backend/ clean-checkpoint/backend/
rsync -av --exclude='node_modules' frontend/ clean-checkpoint/frontend/

# Copy docs, scripts, and root config files
cp -r docs scripts package.json package-lock.json README.md clean-checkpoint/

# Create the zip file
cd clean-checkpoint
zip -r ../$zipname .
cd ..

# Remove staging directory
rm -rf clean-checkpoint

echo "Created archive: $zipname"
