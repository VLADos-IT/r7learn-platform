#!/bin/bash
set -e

ENV_DIR="/opt/R7L-full"
ENV_FILE="$ENV_DIR/.env"
ENV_EXAMPLE="$ENV_DIR/.env.example"

if [ ! -f "$ENV_EXAMPLE" ]; then
    echo "No .env.example found in $ENV_DIR!"
    exit 1
fi

cp "$ENV_EXAMPLE" "$ENV_FILE"

sed -i '1i # Example environment variables for R7L Platform' "$ENV_FILE"

POSTGRES_PASSWORD=$(tr -dc 'A-Za-z0-9!@#$%^&*()_+=' </dev/urandom | head -c 24)

sed -i "s|^POSTGRES_PASSWORD=.*|POSTGRES_PASSWORD=${POSTGRES_PASSWORD}|" "$ENV_FILE"

echo "Generated .env with random password:"
grep POSTGRES_PASSWORD "$ENV_FILE"