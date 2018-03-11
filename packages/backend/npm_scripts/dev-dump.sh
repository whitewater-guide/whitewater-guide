#!/usr/bin/env bash

export $(cat ../../build/.env.development | grep POSTGRES_DB | xargs)
# sed removes all comments and then removes all statements before alter
docker exec ww-db \
    pg_dump -Fc \
            --data-only \
            --schema=public \
            --exclude-table='migrations*' \
            --username=postgres \
    $POSTGRES_DB  > postgres.dump

#            --no-owner \
            #--disable-triggers \