#!/usr/bin/env bash

# What this script does:
# Downloads images from production (default) or staging machine
MACHINE=${1:-production}

docker-machine scp -r -d ww-${MACHINE}:/var/minio/data/avatars ./packages/minio/data
docker-machine scp -r -d ww-${MACHINE}:/var/minio/data/media ./packages/minio/data
docker-machine scp -r -d ww-${MACHINE}:/var/minio/data/banners ./packages/minio/data
docker-machine scp -r -d ww-${MACHINE}:/var/minio/data/covers ./packages/minio/data
tar czf ./packages/minio/images.tar.gz -C ./packages/minio/data media avatars banners covers
