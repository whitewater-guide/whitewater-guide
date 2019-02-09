#!/usr/bin/env bash

PACKAGE_VERSION=$(node -pe "'v'+require('./package.json').version")

docker build -t doomsower/postgres-restore-s3:${PACKAGE_VERSION} .
docker tag doomsower/postgres-restore-s3:${PACKAGE_VERSION} doomsower/postgres-restore-s3:latest
docker push doomsower/postgres-restore-s3:${PACKAGE_VERSION}
docker push doomsower/postgres-restore-s3:latest
