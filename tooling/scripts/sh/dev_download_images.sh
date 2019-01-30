#!/usr/bin/env bash

# What this script does:
# Downloads images from production (default) or staging machine
MACHINE=${1:-production}

docker-machine scp -r -d ww-${MACHINE}:/var/minio/data/avatars ./dev-mount/minio/data
docker-machine scp -r -d ww-${MACHINE}:/var/minio/data/media ./dev-mount/minio/data
docker-machine scp -r -d ww-${MACHINE}:/var/minio/data/banners ./dev-mount/minio/data
docker-machine scp -r -d ww-${MACHINE}:/var/minio/data/covers ./dev-mount/minio/data
tar czf ./dev-mount/minio/images.tar.gz -C ./dev-mount/minio/data media avatars banners covers
