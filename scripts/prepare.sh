#!/usr/bin/env bash

echo "Running prepare"

if [ "$NODE_ENV" == "production" ]; then
    # This block prevents prepare (~= building libs) from running
    # when we install packages in "production" stage of docker file
    # Because they're already built and copied from 'builder' stage
    echo "This is not required in production"
    exit 0
fi

yarn lerna run prepare --stream --no-bail
yarn husky install
