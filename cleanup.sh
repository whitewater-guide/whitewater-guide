#!/usr/bin/env bash

docker-sync-stack clean
docker rmi whitewater_api
docker volume rm whitewater_yarn
docker volume rm whitewater_db
docker volume rm whitewater_redis
docker system prune