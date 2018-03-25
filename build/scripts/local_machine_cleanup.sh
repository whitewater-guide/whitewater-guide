#!/usr/bin/env bash

# Run this script over ssh to initialize reset virtualbox docker-machine
# e.g. run `docker-machine ssh ww-local < local-machine-prepare.sh`

docker stack rm wwguide
# Backend
sudo rm -rf /mnt/sda1/var/pm2/*
# DB
sudo rm -rf /mnt/sda1/var/postgres/data/pgdata/*
# Caddy
sudo rm -rf /etc/caddycerts/*
sudo rm -rf /tmp/caddy/*
# Minio
sudo rm -rf /mnt/sda1/var/minio/data/*
sudo rm -rf /mnt/sda1/var/minio/config/*
# Redis
sudo rm -rf /tmp/redis/*
# Workers
sudo rm -rf /tmp/workers/cookies/*
