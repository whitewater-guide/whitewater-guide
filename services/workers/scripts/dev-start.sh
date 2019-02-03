#!/usr/bin/env bash

IMAGE=workers-dev

mkdir -p $(pwd)/cookies
mkdir -p $(pwd)/cache

docker build --tag ${IMAGE} --file Dockerfile.development .

docker run --rm \
            -it \
            -p 7080:7080 \
            -v $(pwd)/src:/go/src/ \
            -v $(pwd)/cookies:/tmp/cookies \
            -v $(pwd)/cache:/tmp/cache \
            --env-file .env.development \
            ${IMAGE} \
            "$@"
