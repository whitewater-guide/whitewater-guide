#!/usr/bin/env bash

docker-compose up --force-recreate --build --abort-on-container-exit
docker-compose rm -v -f
