#!/usr/bin/env bash

export $(cat .env.production | xargs)

PACKAGE_VERSION=$(node -pe "'v'+require('./package.json').version")

yarn run sentry-cli releases files ${PACKAGE_VERSION} upload-sourcemaps ./build
