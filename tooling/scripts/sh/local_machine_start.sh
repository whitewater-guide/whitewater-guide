#!/usr/bin/env bash

# Run this script to start local deployment

# Create if necessary
docker-machine create ww-local || true
# Start if not running
docker-machine start ww-local || true
# Prepare
docker-machine ssh ww-local < tooling/scripts/sh/local_machine_prepare.sh
# Upload images if they exist
if [ -f "dev-mount/minio/images.tar.gz" ]
then
    cat dev-mount/minio/images.tar.gz | docker-machine ssh ww-local "cd /var/minio/data; sudo tar xzvf -"
fi
# Upload database dump if it exists
if [ -f "services/db/config/dump.bak" ]
then
    docker-machine scp services/db/config/dump.bak ww-local:/tmp/postgres/dump
    docker-machine scp services/db/config/x-dev-restore.sh ww-local:/tmp/postgres/dump
fi
