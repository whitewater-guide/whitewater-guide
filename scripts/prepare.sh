#!/usr/bin/env bash

echo "Running root prepare"

if [ "$NODE_ENV" == "production" ]; then
    # This block prevents prepare (~= building libs) from running
    # when we install packages in "production" stage of docker file
    # Because they're already built and copied from 'builder' stage
    echo "This is not required in production"
    exit 0
fi

pnpm husky install

# pnpm runs lifecycle scripts in following order:
#
# - root pre-install / install / post-install
# - root prepare
# - package pre-install / install / post-install
# - package prepare
#
# So, in order to run codegen, we need to build our codegen-plugins first:
pnpm --filter "@whitewater-guide/codegen-*" --recursive --if-present --stream run build
pnpm codegen

# Now build all libraries that depend on codegen
pnpm --recursive --if-present --stream run workspace:prepare
