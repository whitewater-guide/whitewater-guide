#!/bin/sh

set -e

if [ ! -d $PROJECT_ROOT/node_modules ]; then
  cp -a /tmp/app/node_modules $PROJECT_ROOT
fi

# Watch package.json changes and install them
# see https://github.com/Unitech/pm2/issues/2222
# TODO: remove this (and from Dockerfile as well) when PM2 gets update: https://github.com/Unitech/pm2/issues/2629
SHELL=/bin/sh chokidar package.json -p --poll-interval 300 -c yarn &

# Wait for db
until psql -h "db" -d "$POSTGRES_DB" -U "postgres" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

# Wait for minio
until sh /opt/bin/check_minio.sh; do
  >&2 echo "Minio is unavailable - sleeping"
  sleep 1
done

pm2-dev start pm2.development.json