#!/usr/bin/env bash

set -o allexport
source ../../config/.env.test
source .env.test
set +o allexport

node ./dist/test/pretest.js
