#!/usr/bin/env bash

echo "Running postinstall"

# ignore errors, because when running in docker, frontend packages are not installed in node_modules
# which causes errors like "Patch file found for package react-scripts which is not present at node_modules/react-scripts"
yarn patch-package || true
yarn codegen
