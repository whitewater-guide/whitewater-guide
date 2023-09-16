#!/usr/bin/env bash

if [[ ! -f ios/Podfile.lock ]]; then
  pnpm pod-install
fi

# pnpm jetify
pnpm setup-dev-env

# fixing matix-js-sdk
cat <<< "$(jq 'del(.browser)' ../../node_modules/matrix-js-sdk/package.json)" > ../../node_modules/matrix-js-sdk/package.json
