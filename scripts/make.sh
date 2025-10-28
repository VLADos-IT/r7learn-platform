#!/bin/bash
set -e

## Configuration variables
INSTALL_DIR="/opt/R7L-full"
MONITOR_DIR="/opt/R7L-monitor"
NGINX_CONF_SRC="$INSTALL_DIR/EXTERNAL_nginx_configurations"
NGINX_CONF_DST="/etc/nginx/sites-available"
NGINX_ENABLED="/etc/nginx/sites-enabled"
HTPASSWD_SRC="$INSTALL_DIR/nginx/.htpasswd"
HTPASSWD_DST="/etc/nginx/.htpasswd"
# Replace with your actual email for certbot notifications
EMAIL="vlccommunicate@gmail.com"

CRON_JOB="0 */3 * * * $INSTALL_DIR/scripts/backup.sh"
NETWORK_NAME="monitoring-net"

echo "==> Checking and creating docker network $NETWORK_NAME..."
docker network inspect $NETWORK_NAME >/dev/null 2>&1 || docker network create $NETWORK_NAME
docker network inspect r7l-network >/dev/null 2>&1 || docker network create r7l-network

echo "==> Building and starting main services..."
cd "$INSTALL_DIR"
docker compose build
chown -R 1000:1000 "$INSTALL_DIR/backend/DataProtection-Keys" || true
chown -R 101:101 "$INSTALL_DIR/resources" || true
docker compose up -d

echo "==> Copying nginx configs for main and admin..."

rm -f "$NGINX_ENABLED/r7learn.xorg.su.conf"
rm -f "$NGINX_ENABLED/admin.r7learn.xorg.su.conf"
rm -f "$NGINX_ENABLED/monitor.r7learn.xorg.su.conf"
rm -f "$NGINX_CONF_DST/r7learn.xorg.su.conf"
rm -f "$NGINX_CONF_DST/admin.r7learn.xorg.su.conf"
rm -f "$NGINX_CONF_DST/monitor.r7learn.xorg.su.conf"

cp "$NGINX_CONF_SRC/r7learn.xorg.su.conf" "$NGINX_CONF_DST/"
cp "$NGINX_CONF_SRC/admin.r7learn.xorg.su.conf" "$NGINX_CONF_DST/"
cp "$NGINX_CONF_SRC/monitor.r7learn.xorg.su.conf" "$NGINX_CONF_DST/"

ln -sf "$NGINX_CONF_DST/r7learn.xorg.su.conf" "$NGINX_ENABLED/r7learn.xorg.su.conf"
ln -sf "$NGINX_CONF_DST/admin.r7learn.xorg.su.conf" "$NGINX_ENABLED/admin.r7learn.xorg.su.conf"
ln -sf "$NGINX_CONF_DST/monitor.r7learn.xorg.su.conf" "$NGINX_ENABLED/monitor.r7learn.xorg.su.conf"

cp "$HTPASSWD_SRC" "$HTPASSWD_DST"

echo "==> Setting up monitoring..."

MONITOR_DIR="/opt/R7L-monitor"
INSTALL_DIR="$(pwd)"

if [ -d "$MONITOR_DIR" ]; then
    rm -rf "$MONITOR_DIR"
fi
mkdir -p "$MONITOR_DIR"
cp -r "$INSTALL_DIR/monitoring/"* "$MONITOR_DIR/"
if [ -f "$INSTALL_DIR/.env" ]; then
    echo "==> Copying .env to $MONITOR_DIR/.env (for monitoring exporters)..."
    awk 'BEGIN{FS=OFS="="} /^\s*#/ {print $0; next} NF==2 {gsub(/%/, "%25", $2); gsub(/:/, "%3A", $2); gsub(/@/, "%40", $2); gsub(/\//, "%2F", $2); gsub(/\?/, "%3F", $2); gsub(/&/, "%26", $2); print $1, $2; next} {print $0}' "$INSTALL_DIR/.env" > "$MONITOR_DIR/.env"
else
    echo "==> WARNING: .env file not found in $INSTALL_DIR, monitoring exporters may not work!"
fi

if [ ! -d "$MONITOR_DIR/loki-wal" ]; then
    mkdir -p "$MONITOR_DIR/loki-wal"
fi
chown -R 10001:10001 "$MONITOR_DIR/loki-wal"

if [ ! -d "$MONITOR_DIR/grafana/provisioning/dashboards" ]; then
    mkdir -p "$MONITOR_DIR/grafana/provisioning/dashboards"
fi

cd "$MONITOR_DIR"
chown -R 472:472 ./grafana/data || true
docker compose -f docker-compose.monitoring.yml up -d

echo "==> Reloading nginx..."
systemctl reload nginx

echo "==> Running certbot for SSL certificates..."
certbot --nginx -d r7learn.xorg.su --email "$EMAIL"
certbot --nginx -d admin.r7learn.xorg.su
certbot --nginx -d monitor.r7learn.xorg.su

echo "==> Reloading nginx..."
systemctl reload nginx

echo "==> Adding backup job to crontab..."
( crontab -l 2>/dev/null | grep -v "$INSTALL_DIR/scripts/backup.sh" ; echo "$CRON_JOB" ) | crontab -

echo "==> All services (main, admin, monitoring) started and configured!"
