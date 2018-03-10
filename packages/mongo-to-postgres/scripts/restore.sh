#!/usr/bin/env bash

mkdir -p backup

docker run --rm --name mongorestore \
  --network container:ww_mongo \
  -v $(pwd)/backup:/backup \
  --env-file .env \
  -e "MONGO_URI=mongodb://127.0.0.1:27017/wwdb" \
  -e "MONGORESTORE_WAIT=false" \
  -e "MONGORESTORE_HANG=false" \
  doomsower/mongorestore-s3
