#!/usr/bin/env bash

find src \( -name '*.ts' -o -name '*.tsx' \) -print | xargs jscodeshift --verbose=2 --parser=tsx --extensions=ts,tsx -t node_modules/@material-ui/codemod/lib/v4.0.0/optimal-imports.js
