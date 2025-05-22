#!/bin/bash

# Navigate to the simple portal directory
cd "$(dirname "$0")"

# Pull latest changes
git pull

# Install dependencies if package.json changed
if git diff --name-only HEAD@{1} HEAD | grep -q "package.json"; then
    npm install
fi

# Restart the Node.js process (assuming you're using PM2)
pm2 restart vaderflix-simple || pm2 start server.js --name vaderflix-simple 