# r7learn Platform

## Components

- **frontend** — (r7learn.xorg.su)
- **admin_panel** — (admin.r7learn.xorg.su)
- **backend** — ASP.NET Core
- **converter** — docx → markdown converter
- **TestCreator** — test generator from txt
- **nginx** — internal reverse-proxy for services
- **EXTERNAL_nginx_configurations** — external nginx configs for VDS

---

## Quick Start

```sh
cd /opt/
git clone https://github.com/VLADos-IT/R7L_full.git
cd R7L_full
```

### 1. Build and run all services

```sh
docker compose build
docker compose up -d
```

### 1. Nginx and let's encrypt

```sh
cp /opt/R7L-full/EXTERNAL_nginx_configurations/r7learn.xorg.su.conf /etc/nginx/sites-available/
ln -s /etc/nginx/sites-available/r7learn.xorg.su.conf /etc/nginx/sites-enabled/
cp /opt/R7L-full/EXTERNAL_nginx_configurations/admin.r7learn.xorg.su.conf /etc/nginx/sites-available/
ln -s /etc/nginx/sites-available/admin.r7learn.xorg.su.conf /etc/nginx/sites-enabled/
cp /opt/R7L-full/nginx/.htpasswd /etc/nginx/
systemctl start nginx
certbot --nginx -d r7learn.xorg.su -d admin.r7learn.xorg.su
systemctl restart nginx
```

## Access fix

```sh
chown -R 101:101 ./resources
```

### 2. Check the services

- **User interface:**  <https://r7learn.xorg.su>
- **Admin panel:**  <https://admin.r7learn.xorg.su>

## Update

```sh
git pull
docker compose build
docker compose up -d
```

## UNINSTALL

```sh
docker compose down
docker system prune -a --volumes --force &&  docker builder prune --all --force
docker compose down -v --remove-orphans
rm -rf /etc/nginx/sites-enabled/r7learn.xorg.su.conf
rm -rf /etc/nginx/sites-enabled/admin.r7learn.xorg.su.conf
systemctl reload nginx
```

## LetsEncrypt SSL certs delete

```sh
certbot delete --cert-name r7learn.xorg.su
certbot delete --cert-name admin.r7learn.xorg.su
```
