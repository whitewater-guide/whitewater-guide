#!/usr/bin/env bash

docker run --rm --name mongorestore \
  --network container:ww_mongo \
  -v $(pwd)/backup:/backup \
  --env-file .env \
  doomsower/mongorestore-s3
