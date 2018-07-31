#!/usr/bin/env bash

# (find node_modules -type f -name .babelrc | grep -v /react-native/ | xargs rm) || true

rndebugger-open

yarn run patch-package
yarn run ios:fix-xcode
