#!/usr/bin/env bash

(find node_modules -type f -name .babelrc | grep -v /react-native/ | xargs rm) || true

# TODO: BUGWATCH: https://github.com/oblador/react-native-vector-icons/issues/626#issuecomment-364106193
# rm ./node_modules/react-native/local-cli/core/__fixtures__/files/package.json

rndebugger-open

yarn run patch-package
yarn run ios:fix-xcode
