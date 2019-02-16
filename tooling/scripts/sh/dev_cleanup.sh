#!/usr/bin/env bash

rm -rf dev-mount/minio/config/*
rm -rf dev-mount/minio/data/*
rm -rf dev-mount/workers/cookies/*
rm -rf dev-mount/workers/cache/*
docker rm --force --volumes $(docker ps -a --filter="label=guide.whitewater" -q)
docker image rm --force $(docker image ls --filter "label=guide.whitewater" -q)
docker system prune --force --volumes
