#!/usr/bin/env bash

export $(cat ../../build/.env.development | grep POSTGRES_DB | xargs)


# Plain sql format
docker exec ww-db \
    pg_dump --data-only \
            --no-owner \
            --no-privileges \
            --disable-triggers \
            --schema=public \
            --column-inserts \
            --exclude-table='migrations*' \
            --username=postgres \
    $POSTGRES_DB  > src/seeds/development/dump.sql

cp src/seeds/development/dump.sql src/seeds/production/dump.sql
