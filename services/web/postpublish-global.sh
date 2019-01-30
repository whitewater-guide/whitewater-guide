#!/usr/bin/env bash

node ../../tooling/scripts/bin/dockerPublish.js

export $(cat .env.production | xargs)

PACKAGE_VERSION=$(node -pe "'v'+require('./package.json').version")

yarn run sentry-cli releases files ${PACKAGE_VERSION} upload-sourcemaps ./build
