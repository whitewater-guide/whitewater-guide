#!/usr/bin/env bash

echo "Manually publishing backend to github packages"

PACKAGE_VERSION=$(node -p -e "require('./packages/backend/package.json').version")

docker build --platform linux/amd64 -t ghcr.io/whitewater-guide/backend:${PACKAGE_VERSION} -f ./packages/backend/Dockerfile .
docker push ghcr.io/whitewater-guide/backend:${PACKAGE_VERSION}
