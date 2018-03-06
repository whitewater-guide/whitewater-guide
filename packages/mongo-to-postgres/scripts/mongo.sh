#!/usr/bin/env bash

docker run -d --name ww_mongo -p 3334:27017 -v $(pwd)/data:/data/db mongo:3.2
