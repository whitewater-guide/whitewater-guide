#!/usr/bin/env bash

node_modules/.bin/rndebugger-open

if [[ ! -f ios/Podfile.lock ]]; then
  npx pod-install
fi

yarn patch-package
yarn jetify
yarn setup-dev-env
