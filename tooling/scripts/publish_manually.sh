#!/usr/bin/env bash

echo "Manually publishing backend to github packages"

PACKAGE_VERSION=$(node -p -e "require('./packages/backend/package.json').version")

docker build -t ghcr.io/whitewater-guide/backend:${PACKAGE_VERSION} -f ./packages/backend/Dockerfile .
docker push ghcr.io/whitewater-guide/backend:${PACKAGE_VERSION}
