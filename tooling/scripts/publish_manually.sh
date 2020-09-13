#!/usr/bin/env bash

echo "Manually publishing backend to github packages"

PACKAGE_VERSION=$(node -p -e "require('./packages/backend/package.json').version")

docker build -t docker.pkg.github.com/whitewater-guide/whitewater-guide/backend:${PACKAGE_VERSION} -f ./packages/backend/Dockerfile .
docker push docker.pkg.github.com/whitewater-guide/whitewater-guide/backend:${PACKAGE_VERSION}
