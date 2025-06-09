#!/bin/bash

docker compose down --remove-orphans

docker system prune -af


sudo apt-get autoremove -y
sudo apt-get autoclean -y
rm -rf /tmp/*
rm -rf ~/.cache/*
