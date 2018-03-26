#!/usr/bin/env bash

# Run this script to start local deployment

# Create if necessary
docker-machine create ww-local || true
# Start if not running
docker-machine start ww-local || true
# Prepare
docker-machine ssh ww-local < build/scripts/local_machine_prepare.sh
# Upload images if they exist
if [ -f "packages/minio/images.tar.gz" ]
then
    cat packages/minio/images.tar.gz | docker-machine ssh ww-local "cd /var/minio/data; sudo tar xzvf -"
fi
