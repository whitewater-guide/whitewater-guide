#! /bin/bash

set -e

export TS_NODE_FILES=true
pnpm ts-node -r dotenv-flow/config src/test/prestart.ts
pnpm dlx nodemon src/index.ts
