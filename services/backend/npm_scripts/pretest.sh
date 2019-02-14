#!/usr/bin/env bash

set -o allexport
source ../../config/.env.test
source ../../config/.env.test.local
source .env.test
source .env.test.local
set +o allexport

node ./dist/test/pretest.js
