#!/usr/bin/env bash

docker build -t doomsower/caddy:8 .
docker push doomsower/caddy:8
