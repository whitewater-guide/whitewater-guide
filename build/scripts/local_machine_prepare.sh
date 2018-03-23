#!/usr/bin/env bash

# Run this script over ssh to initialize local virtualbox docker-machine
# e.g. run `docker-machine ssh ww-local < local-machine-prepare.sh`

# Backend
sudo mkdir -p /mnt/sda1/var/pm2
sudo ln -s /mnt/sda1/var/pm2 /var/pm2
# DB
sudo mkdir -p /tmp/postgres
sudo mkdir -p /mnt/sda1/var/postgres/data/pgdata
sudo ln -s /mnt/sda1/var/postgres /var/postgres
# Caddy
sudo mkdir -p /etc/caddycerts
sudo mkdir -p /tmp/caddy
# Minio
sudo mkdir -p /mnt/sda1/var/minio/data
sudo mkdir -p /mnt/sda1/var/minio/config
sudo ln -s /mnt/sda1/var/minio /var/minio
# Redis
sudo mkdir -p /tmp/redis
# Workers
sudo mkdir -p /tmp/workers/cookies


docker swarm init --advertise-addr eth1
