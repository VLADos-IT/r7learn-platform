#!/bin/bash

set -e

INSTALL_DIR="/opt/R7L_full"

echo "==> Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

echo "==> Updating repository..."
cd "$INSTALL_DIR"
git pull

echo "==> Checking .env..."
if [ ! -f .env ]; then
    echo ".env not found! Please create it from .env.example and set real secrets."
    exit 1
fi

echo "==> Building and restarting all services..."
docker compose build
docker compose up -d

echo "==> Done! System and services updated."