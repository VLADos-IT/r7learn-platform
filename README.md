# r7learn Platform

## Components

- **frontend** — (r7learn.xorg.su)
- **admin_panel** — (admin.r7learn.xorg.su)
- **backend** — ASP.NET Core
- **converter** — docx → markdown converter
- **TestCreator** — test generator from txt
- **nginx** — internal reverse-proxy for services
- **EXTERNAL_nginx_configurations** — external nginx configs
- **integration_test** — automated integration tests
- **Monitoring** — system monitor for platform

---

## Architecture Diagram

![Architecture](docs/architecture.drawio.png)

## Directory Structure

```sh
R7L-full/
├── admin_panel/         # Admin panel (frontend for admins)
├── backend/             # Backend (ASP.NET Core)
├── converter/           # docx → markdown converter service
├── TestCreator/         # Test generator
├── frontend/            # Main user frontend
├── nginx/               # Nginx configs and .htpasswd
├── resources/           # Uploaded files
├── monitoring/          # System Monitor (R7L-monitor)
├── integration_test/    # Integration tests
├── scripts/             # Utility scripts
├── docker-compose.yml   # Docker Compose configuration
├── .env                 # Environment variables
```

## Environment Variables

- `POSTGRES_USER` — database user name
- `POSTGRES_PASSWORD` — database user password
- `POSTGRES_DB` — database name
- `JWT_SECRET` — JWT Secret for backend authentication

---

## Quick Start (Recommended)

> **Use provided scripts for fast setup and maintenance**

```sh
cd /opt/R7L-full/
mv .env.example ./scripts
cd /opt/R7L-full/scripts
bash gen_env.sh
mv .env ../
nano make.sh        # EDIT EMAIL
bash make.sh        # Build and start all services
```

> ⚠️ **WARNING:**
> R7L-monitor not start with make.sh, please run service manual.

---

## Manual Setup (Step-by-step Guide)

### 1. Clone the repository

```sh
cd /opt/
git clone https://github.com/VLADos-IT/R7L-full.git
cd R7L-full
```

### 2. Generate .env file

```sh
cd /opt/R7L-full/
cp .env.example ./scripts
cd ./scripts
bash gen_env.sh
mv .env ../
```

### 3. Build and run all services

```sh
docker network create r7l-network
docker compose build
docker compose up -d
```

### 4. Nginx and Let's Encrypt

```sh
cp /opt/R7L-full/EXTERNAL_nginx_configurations/r7learn.xorg.su.conf /etc/nginx/sites-available/
ln -s /etc/nginx/sites-available/r7learn.xorg.su.conf /etc/nginx/sites-enabled/
cp /opt/R7L-full/EXTERNAL_nginx_configurations/admin.r7learn.xorg.su.conf /etc/nginx/sites-available/
ln -s /etc/nginx/sites-available/admin.r7learn.xorg.su.conf /etc/nginx/sites-enabled/
cp /opt/R7L-full/EXTERNAL_nginx_configurations/monitor.r7learn.xorg.su.conf /etc/nginx/sites-available/
ln -s /etc/nginx/sites-available/monitor.r7learn.xorg.su.conf /etc/nginx/sites-enabled/
cp /opt/R7L-full/nginx/.htpasswd /etc/nginx/
systemctl start nginx
certbot --nginx -d r7learn.xorg.su
certbot --nginx -d admin.r7learn.xorg.su
certbot --nginx -d monitor.r7learn.xorg.su
systemctl restart nginx
```

### 5. Fix access rights for uploads

```sh
chown -R 101:101 ./resources
chown -R 101:101 ./backend/DataProtection-Keys
chown -R 472:472 ./grafana/data
```

### 6. Create System Monitoring

```sh
mkdir /opt/R7L-monitor
cp -r /opt/R7L-full/monitoring /opt/R7L-monitor
docker network create monitoring-net
cd /opt/R7L-monitor
docker compose -f docker-compose.monitoring.yml up -d
```

### 7. Check the services

- **User interface:**  <https://r7learn.xorg.su>
- **Admin panel:**  <https://admin.r7learn.xorg.su>
- **Monitor panel:**  <https://monitor.r7learn.xorg.su>

## Backup and Restore

### Backup

```sh
bash scripts/backup.sh
```

### Restore

```sh
docker exec -i r7l-postgres psql -U $POSTGRES_USER -d $POSTGRES_DB < /opt/r7l_backups/db_backup_YYYY-MM-DD_HH-MM-SS.sql
```

```sh
tar xzf /opt/r7l_backups/resources_YYYY-MM-DD_HH-MM-SS.tar.gz -C /opt/R7L-full/resources
```

---

## Integration Tests

Integration tests run automatically via Docker Compose on build.

To run manually:

```sh
docker compose run --rm integration-test
```

---

## API Reference

See [docs/API.md](./docs/API.md) for a full description of all backend API endpoints, request/response formats, and error handling.

## Update

> **Recommended:**  
> Use the script:  
> `bash scripts/update.sh`

Or manually:

```sh
git pull
docker compose build
docker compose up -d
```

---

## Uninstall

> ⚠️ **WARNING:**  
> `docker compose down -v --remove-orphans` will remove all Docker volumes, including your database volume.  
> **This will erase all database data!**  
> Use with caution and only if you have backups or do not need the data.
> **Recommended:**  
> Use the script:  
> `bash scripts/cleanup.sh`

Fully uninstall:

```sh
docker compose down
docker system prune -a --volumes --force &&  docker builder prune --all --force
docker compose down -v --remove-orphans
rm -rf /etc/nginx/sites-enabled/r7learn.xorg.su.conf
rm -rf /etc/nginx/sites-enabled/admin.r7learn.xorg.su.conf
rm -rf /etc/nginx/sites-enabled/monitor.r7learn.xorg.su.conf
systemctl reload nginx
```

**MONITORING:**
> Alerts to email setup on webpage monitoring system.

```sh
docker compose -f docker-compose.monitoring.yml down -v --remove-orphans
```

---

## LetsEncrypt SSL certs delete

```sh
certbot delete --cert-name r7learn.xorg.su
certbot delete --cert-name admin.r7learn.xorg.su
certbot delete --cert-name monitor.r7learn.xorg.su

```
