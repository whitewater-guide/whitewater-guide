#!/usr/bin/env bash

export NODE_ENV=staging

sh build.sh

# Step 4
# Check if mongo service is running
docker-compose -f ${NODE_ENV}.yml exec mongo echo 'Is mongo alive?'
if [ $? -eq 0 ]; then
    echo "Mongo service is running, recreating passenger..."
    docker-compose -f ${NODE_ENV}.yml up -d --build --no-deps --force-recreate passenger
else
    echo "Mongo service is not running, launching everything"
    docker-compose -f ${NODE_ENV}.yml up -d --build --force-recreate
fi
