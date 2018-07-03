#!/usr/bin/env bash

# What this script does:
# Downloads images from old (v1) backend to to media bucket of locally (dev) mounted minio volume
# So in dev environment images are available
# It also compresses them so they can be built into image (for local, staging deploys)

docker-machine scp -r -d ww-production:/var/minio/data/ ./packages/minio/data
tar czf ./packages/minio/images.tar.gz -C ./packages/minio data
