#!/usr/bin/env bash

docker build -t doomsower/caddy:6 .
docker push doomsower/caddy:6
