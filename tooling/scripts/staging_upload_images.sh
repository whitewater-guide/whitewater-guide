#!/usr/bin/env bash

# What this script does:
# Uploads images to staging machine

docker-machine scp -r -d ./dev-mount/minio/data/avatars ww-production:/var/minio/data
docker-machine scp -r -d ./dev-mount/minio/data/media ww-production:/var/minio/data
