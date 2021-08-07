#!/usr/bin/env bash

node_modules/.bin/rndebugger-open

if [[ ! -f ios/Podfile.lock ]]; then
  yarn pod-install
fi

# react should be hoisted, but cannot have exclusions
# so we just delete it and use react from root node_modules
rm -rf node_modules/react/

yarn jetify
yarn setup-dev-env
