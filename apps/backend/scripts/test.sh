#! /bin/bash

set -e

export NODE_ENV=test
export TS_NODE_FILES=true
# https://nodejs.org/docs/latest-v18.x/api/cli.html#tz
# it's here so it's used in both db preseeding and tests
export TZ="Etc/UTC"
pnpm ts-node -r dotenv-flow/config src/test/pretest.ts
pnpm jest --forceExit $@
