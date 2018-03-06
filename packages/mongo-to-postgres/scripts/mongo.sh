#!/usr/bin/env bash

mkdir -p data

docker run -d --name ww_mongo -p 27017:27017 -v $(pwd)/data:/data/db mongo:3.2
