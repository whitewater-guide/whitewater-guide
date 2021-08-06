#!/usr/bin/env bash

echo "Setting up development volumes in $(pwd)"

mkdir -p ./dev-mount/minio/config
mkdir -p ./dev-mount/minio/data
mkdir -p ./dev-mount/minio/log
mkdir -p ./dev-mount/gorge/cookies
mkdir -p ./dev-mount/gorge/cache

echo "Development volumes setup complete"

docker-compose up
