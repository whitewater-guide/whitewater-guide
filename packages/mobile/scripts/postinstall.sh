#!/usr/bin/env bash

node_modules/.bin/rndebugger-open

if [[ ! -f ios/Podfile.lock ]]; then
  yarn pod-install
fi

yarn jetify
yarn setup-dev-env
