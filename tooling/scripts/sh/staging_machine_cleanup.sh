#!/usr/bin/env bash

# Run this script over ssh to initialize reset virtualbox docker-machine
# e.g. run `docker-machine ssh ww-local < local-machine-prepare.sh`

docker stack rm wwguide
# Backend
sudo sh -c "rm -rf /var/pm2/*"
# DB
sudo sh -c "rm -rf /var/postgres/data/pgdata/*"
sudo sh -c "rm -rf /var/run/postgresql/*"
sudo sh -c "rm -rf /tmp/postgres/*"

# Caddy
# Keep certs
# sudo sh -c "rm -rf /etc/caddycerts/*"
sudo sh -c "rm -rf /var/caddy/cache/*"
# Minio
sudo sh -c "rm -rf /var/minio/data/temp/*"
sudo sh -c "rm -rf /var/minio/data/avatars/*"
sudo sh -c "rm -rf /var/minio/data/media/*"
sudo sh -c "rm -rf /var/minio/config/*"
sudo sh -c "rm -rf /tmp/minio/*"
# Redis
sudo sh -c "rm -rf /tmp/redis/*"
# Workers
sudo sh -c "rm -rf /tmp/workers/cookies/*"
# Adminer
sudo sh -c "rm -rf /tmp/adminer/*"
