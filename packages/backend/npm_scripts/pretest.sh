#!/usr/bin/env bash

set -o allexport
source ../../build/.env.test
source ../../build/.env.test.local
source .env.test
source .env.test.local
set +o allexport

node ./dist/test/pretest.js
