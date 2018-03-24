#!/usr/bin/env bash

# Volumes are mounted here
mkdir data
mkdir backup

docker-compose up --force-recreate --build --abort-on-container-exit
docker-compose rm -v -f
