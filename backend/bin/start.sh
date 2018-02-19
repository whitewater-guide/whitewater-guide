#!/bin/sh

if [ ! -d $PROJECT_ROOT/node_modules ]; then
  cp -a /tmp/app/node_modules $PROJECT_ROOT
fi

# Watch package.json changes and install them
# see https://github.com/Unitech/pm2/issues/2222
# TODO: remove this (and from Dockerfile as well) when PM2 gets update: https://github.com/Unitech/pm2/issues/2629
SHELL=/bin/sh chokidar package.json -p --poll-interval 300 -c yarn &

# Wait for db, because delay-restart doesn't work with pm2-dev
sleep 5
# TODO: dev or production
pm2-dev start "$PROJECT_ROOT/src/index.js" --node-args="--inspect=0.0.0.0:5775"