#!/usr/bin/env bash

docker build -t doomsower/postgres-restore-s3:1 .
docker push doomsower/postgres-restore-s3:1
