#!/usr/bin/env bash

# Run this script over ssh to initialize local virtualbox docker-machine
# e.g. run `docker-machine ssh ww-local < local-machine-prepare.sh`

# Backend
sudo mkdir -p /mnt/sda1/var/pm2
sudo ln -s /mnt/sda1/var/pm2 /var/pm2
# DB
sudo mkdir -p /tmp/postgres
sudo mkdir -p /tmp/postgres/dump
sudo mkdir -p /mnt/sda1/var/postgres/data/pgdata
sudo ln -s /mnt/sda1/var/postgres /var/postgres
# This fixes boot2docker vm permissions
sudo chmod -R 777 /tmp/postgres
sudo chmod -R 777 /mnt/sda1/var/postgres
# Caddy
sudo mkdir -p /etc/caddycerts
sudo mkdir -p /mnt/sda1/var/caddy/cache
sudo ln -s /mnt/sda1/var/caddy /var/caddy
# Minio
sudo mkdir -p /tmp/minio
sudo mkdir -p /mnt/sda1/var/minio/data/temp
sudo mkdir -p /mnt/sda1/var/minio/data/media
sudo mkdir -p /mnt/sda1/var/minio/data/avatars
sudo mkdir -p /mnt/sda1/var/minio/data/banners
sudo mkdir -p /mnt/sda1/var/minio/data/covers
sudo mkdir -p /mnt/sda1/var/minio/config
sudo ln -s /mnt/sda1/var/minio /var/minio
# Redis
sudo mkdir -p /tmp/redis
# Workers
sudo mkdir -p /tmp/workers/cookies
# Adminer
sudo mkdir -p /tmp/adminer
# imageproxy
sudo mkdir -p /mnt/sda1/var/imageproxy
sudo ln -s /mnt/sda1/var/imageproxy /var/imageproxy

docker swarm init --advertise-addr eth1
