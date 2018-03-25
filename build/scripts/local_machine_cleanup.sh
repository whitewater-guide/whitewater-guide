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
sudo sh -c "rm -rf /etc/caddycerts/*"
sudo sh -c "rm -rf /tmp/caddy/*"
# Minio
sudo sh -c "rm -rf /var/minio/data/*"
sudo sh -c "rm -rf /var/minio/config/*"
# Redis
sudo sh -c "rm -rf /tmp/redis/*"
# Workers
sudo sh -c "rm -rf /tmp/workers/cookies/*"
