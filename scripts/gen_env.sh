#!/bin/bash
set -e

ENV_FILE=".env"
ENV_EXAMPLE=".env.example"

if [ -f "$ENV_FILE" ]; then
    echo ".env already exists, skipping."
    exit 0
fi

if [ -f "$ENV_EXAMPLE" ]; then
    cp "$ENV_EXAMPLE" "$ENV_FILE"
    sed -i '1{/^#/d}' "$ENV_FILE"
    echo "Copied .env from .env.example"
else
    echo "No .env.example, please create it manually!"
    exit 1
fi

if grep -q 'POSTGRES_PASSWORD=' "$ENV_FILE"; then
    PASS=$(tr -dc 'A-Za-z0-9!@#$%^&*()_+=' </dev/urandom | head -c 24)
    sed -i "s|POSTGRES_PASSWORD=|POSTGRES_PASSWORD=$PASS|" "$ENV_FILE"
    echo "Generated password for POSTGRES_PASSWORD"
fi

if grep -q 'JWT_SECRET=' "$ENV_FILE"; then
    JWT=$(tr -dc 'A-Za-z0-9' </dev/urandom | head -c 32)
    sed -i "s|JWT_SECRET=|JWT_SECRET=$JWT|" "$ENV_FILE"
    echo "Generated JWT_SECRET"
fi