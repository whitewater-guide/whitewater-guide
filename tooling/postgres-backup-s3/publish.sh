#!/usr/bin/env bash

PACKAGE_VERSION=$(node -p -e "require('./package.json').version.split('.')[0]")
export $(cat .env | xargs)
docker logout
docker login --username ${DOCKER_USER} --password ${DOCKER_PASSWORD}
docker build doomsower/postgres-backup-s3:${PACKAGE_VERSION} .
docker tag doomsower/postgres-backup-s3:${PACKAGE_VERSION} doomsower/postgres-backup-s3:latest
docker push doomsower/postgres-backup-s3:${PACKAGE_VERSION}
docker push doomsower/postgres-backup-s3:latest
