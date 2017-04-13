#!/usr/bin/env bash

export NODE_ENV=production

# Pass build `./production.sh build' to build backend and client from anew
if [ "$1" = "build" ]
then
    sh build.sh
fi

eval $(docker-machine env wwguide)

# Step 4
# In production, we have to down everything, otherwise we will run out of memory
# while building new images
docker-compose -f ${NODE_ENV}.yml down
docker rm $(docker ps -a -q)
docker rmi $(docker images --quiet --filter "dangling=true")
docker-compose -f ${NODE_ENV}.yml up -d --build
