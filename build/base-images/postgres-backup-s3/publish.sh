#!/usr/bin/env bash

docker build -t doomsower/postgres-backup-s3:1 .
docker push doomsower/postgres-backup-s3:1
