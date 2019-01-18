#!/usr/bin/env bash

# (find node_modules -type f -name .babelrc | grep -v /react-native/ | xargs rm) || true

node_modules/.bin/rndebugger-open

yarn run patch-package
yarn run ios:fix-xcode
