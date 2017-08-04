#!/usr/bin/env bash

docker-sync-stack clean
docker rmi whitewaterapi_api
docker volume rm whitewaterapi_yarn
docker volume rm whitewaterapi_db
docker volume rm whitewaterapi_redis
docker system prune