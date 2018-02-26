#!/bin/sh

# Docker image will contain fake images in tmp folder
# During runtime, they should be placed in minio data folder, which happens to be docker volume
# Use CP instead of MV because container is read_only
mkdir -p /data/uploads
cp -R  /tmp/* /data/uploads/

./usr/bin/docker-entrypoint.sh server /data
