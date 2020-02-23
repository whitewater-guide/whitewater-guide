#!/usr/bin/env bash

set -o allexport
source ../../config/.env.test
source ../../config/.env.test.local
source .env.test
source .env.test.local
set +o allexport

node --inspect=0.0.0.0:9230 ./node_modules/jest/bin/jest.js --forceExit "$@"
