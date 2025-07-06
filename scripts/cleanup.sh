#!/bin/bash
set -e

INSTALL_DIR="/opt/R7L-full"

if [ -d "$INSTALL_DIR" ]; then
    cd "$INSTALL_DIR"
    echo "==> Stopping and removing all containers and volumes..."
    docker compose down --remove-orphans || true
fi


MONITOR_DIR="/opt/R7L-monitor"
if [ -d "$MONITOR_DIR" ]; then
    echo "==> Stopping and removing R7L-monitor..."
    cd "$MONITOR_DIR"
    docker compose -f docker-compose.monitoring.yml down --remove-orphans || true
fi

echo "==> Cleaning docker system..."
docker system prune -af || true
docker volume prune -f || true

echo "==> Cleanup completed!"