#!/usr/bin/env bash

node_modules/.bin/rndebugger-open

if [[ ! -f ios/Podfile.lock ]]; then
  (cd ios && pod install)
fi

yarn run patch-package
yarn jetify
