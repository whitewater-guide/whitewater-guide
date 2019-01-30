#!/usr/bin/env bash

docker build -t doomsower/postgres-restore-s3:3 .
docker push doomsower/postgres-restore-s3:3
