#!/usr/bin/env bash

rm -rf dev-mount/db/*
rm -rf dev-mount/minio/config/*
rm -rf dev-mount/minio/data/*
docker rm --force --volumes $(docker ps -a --filter="label=guide.whitewater" -q)
docker image rm --force $(docker image ls --filter "label=guide.whitewater" -q)
docker system prune --force --volumes
