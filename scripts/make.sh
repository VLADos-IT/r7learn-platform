#!/bin/bash
set -e

# ---------------- Configuration ----------------
INSTALL_DIR="/opt/R7L-full"
MONITOR_DIR="/opt/R7L-monitor"
NGINX_CONF_SRC="$INSTALL_DIR/EXTERNAL_nginx_configurations"
NGINX_CONF_DST="/etc/nginx/sites-available"
NGINX_ENABLED="/etc/nginx/sites-enabled"
HTPASSWD_SRC="$INSTALL_DIR/nginx/.htpasswd"
HTPASSWD_DST="/etc/nginx/.htpasswd"

# Add Email
EMAIL=""

CRON_JOB="0 */3 * * * $INSTALL_DIR/scripts/backup.sh"
# ------------------------------------------------

cd "$INSTALL_DIR"
docker compose build
chown -R 1000:1000 "$INSTALL_DIR/backend/DataProtection-Keys" || true
chown -R 101:101 "$INSTALL_DIR/resources" || true
docker compose up -d

for conf in r7learn.xorg.su.conf admin.r7learn.xorg.su.conf monitor.r7learn.xorg.su.conf; do
    rm -f "$NGINX_CONF_DST/$conf" "$NGINX_ENABLED/$conf"
    cp "$NGINX_CONF_SRC/$conf" "$NGINX_CONF_DST/"
    ln -sf "$NGINX_CONF_DST/$conf" "$NGINX_ENABLED/$conf"
done
cp "$HTPASSWD_SRC" "$HTPASSWD_DST"

rm -rf "$MONITOR_DIR"
mkdir -p "$MONITOR_DIR"
cp -r "$INSTALL_DIR/monitoring/"* "$MONITOR_DIR/"

mkdir -p "$MONITOR_DIR/loki-wal" "$MONITOR_DIR/grafana/provisioning/dashboards"
chown -R 10001:10001 "$MONITOR_DIR/loki-wal"
chown -R 472:472 "$MONITOR_DIR/grafana/data" || true

cd "$MONITOR_DIR"
docker compose -f docker-compose.monitoring.yml up -d

systemctl reload nginx

for domain in r7learn.xorg.su admin.r7learn.xorg.su monitor.r7learn.xorg.su; do
    if [ -n "$EMAIL" ]; then
        certbot --nginx -d "$domain" --email "$EMAIL" --agree-tos --non-interactive
    else
        certbot --nginx -d "$domain" --register-unsafely-without-email --agree-tos --non-interactive
    fi
done

systemctl reload nginx

(crontab -l 2>/dev/null | grep -v "$INSTALL_DIR/scripts/backup.sh"; echo "$CRON_JOB") | crontab -

echo "==> All services started"

