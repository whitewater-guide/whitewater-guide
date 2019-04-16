#!/bin/sh

set -e

export NODE_PATH=/opt/app/node_modules:$NODE_PATH
# Wait for db
until node /opt/bin/check_postgres.js; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

# Wait for minio
until node /opt/bin/check_minio.js; do
  >&2 echo "Minio is unavailable - sleeping"
  sleep 1
done

cp -rf /tmp/.pm2/* /root/.pm2

pm2-runtime start pm2.production.json --web --raw
