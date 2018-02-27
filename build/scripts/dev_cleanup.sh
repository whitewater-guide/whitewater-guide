#!/usr/bin/env bash

docker-sync-stack clean
docker rm --force --volumes $(docker ps -a --filter="label=guide.whitewater" -q)
docker image rm $(docker image ls --filter "label=guide.whitewater")
docker system prune --force --volumes