#!/usr/bin/env bash

# What this script does:
# Downloads images from staging machine

docker-machine scp -r -d ww-staging:/var/minio/data/avatars ./dev-mount/minio/data
docker-machine scp -r -d ww-staging:/var/minio/data/media ./dev-mount/minio/data
tar czf ./dev-mount/minio/images.tar.gz -C ./dev-mount/minio/data media avatars
