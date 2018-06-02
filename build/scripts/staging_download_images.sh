#!/usr/bin/env bash

# What this script does:
# Downloads images from staging machine

docker-machine scp -r -d ww-staging:/var/minio/data/avatars ./packages/minio/data
docker-machine scp -r -d ww-staging:/var/minio/data/media ./packages/minio/data
tar czf ./packages/minio/images.tar.gz -C ./packages/minio/data media avatars
