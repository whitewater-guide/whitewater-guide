#!/usr/bin/env bash

IMAGE=workers-dev

docker build --no-cache --tag ${IMAGE} --file Dockerfile.development .

docker run --rm \
            -it \
            -p 7080:7080 \
            -v $(pwd)/src:/go/src/ \
            -v $(pwd)/realize:/realize \
            -v $(pwd)/cookies:/tmp/cookies \
            --env-file .env.development \
            ${IMAGE}