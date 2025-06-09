#!/bin/bash
set -e

REPO_URL="https://github.com/VLADos-IT/R7L_full.git"
INSTALL_DIR="/opt/R7L_full"
ENV_FILE=".env"
ENV_EXAMPLE=".env.example"
POSTGRES_USER="r7l_admin"
POSTGRES_DB="r7l"

generate_password() {
    tr -dc 'A-Za-z0-9!@#$%^&*()_+=' </dev/urandom | head -c 24
}

cleanup_old_install() {
    echo "==> Cleaning up old Docker containers, volumes, and networks..."
    docker compose down -v --remove-orphans || true
    docker system prune -af || true
    docker volume prune -f || true
}
echo "==> Cleaning up previous installation leftovers..."
if [ -d "$INSTALL_DIR" ]; then
    cd "$INSTALL_DIR"
    cleanup_old_install
    cd /
    rm -rf "$INSTALL_DIR"
fi

echo "==> Cloning repository..."
git clone "$REPO_URL" "$INSTALL_DIR"

cd "$INSTALL_DIR"

echo "==> Creating .env from template..."
if [ ! -f "$ENV_FILE" ]; then
    cp "$ENV_EXAMPLE" "$ENV_FILE"
    POSTGRES_PASSWORD=$(generate_password)
    sed -i "s|POSTGRES_USER=.*|POSTGRES_USER=${POSTGRES_USER}|" "$ENV_FILE"
    sed -i "s|POSTGRES_PASSWORD=.*|POSTGRES_PASSWORD=${POSTGRES_PASSWORD}|" "$ENV_FILE"
    sed -i "s|POSTGRES_DB=.*|POSTGRES_DB=${POSTGRES_DB}|" "$ENV_FILE"
    echo "Generated .env with random password for PostgreSQL."
    echo "POSTGRES_USER=${POSTGRES_USER}"
    echo "POSTGRES_PASSWORD=${POSTGRES_PASSWORD}"
    echo "POSTGRES_DB=${POSTGRES_DB}"
else
    echo ".env already exists. Please check its contents."
fi

echo "==> Installing Docker and Docker Compose if needed..."
if ! command -v docker &>/dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable --now docker
fi
if ! command -v docker-compose &>/dev/null; then
    DOCKER_COMPOSE_VERSION="2.29.2"
    curl -SL "https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

echo "==> Building and starting all services..."
docker compose build
docker compose up -d

echo "==> Copying nginx configs and .htpasswd..."
cp EXTERNAL_nginx_configurations/r7learn.xorg.su.conf /etc/nginx/sites-available/
ln -sf /etc/nginx/sites-available/r7learn.xorg.su.conf /etc/nginx/sites-enabled/
cp EXTERNAL_nginx_configurations/admin.r7learn.xorg.su.conf /etc/nginx/sites-available/
ln -sf /etc/nginx/sites-available/admin.r7learn.xorg.su.conf /etc/nginx/sites-enabled/
cp nginx/.htpasswd /etc/nginx/

echo "==> Restarting nginx..."
systemctl restart nginx

echo "==> Fixing permissions for resources folder..."
chown -R 101:101 ./resources || true

echo "==> (Optional) Obtaining Let's Encrypt SSL certificates..."
if command -v certbot &>/dev/null; then
    certbot --nginx -d r7learn.xorg.su -d admin.r7learn.xorg.su || true
    systemctl restart nginx
else
    echo "Certbot is not installed. Install it for SSL: apt install certbot python3-certbot-nginx"
fi

echo "==> Checking service status..."
docker compose ps
echo "==> Installation complete!"
echo "Check availability: https://r7learn.xorg.su and https://admin.r7learn.xorg.su"