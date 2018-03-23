#!/usr/bin/env bash

export $(cat ../../build/.env.development | grep POSTGRES_DB | xargs)
# sed removes all comments and then removes all statements before alter
docker exec -i ww-db pg_restore --username=postgres --dbname=$POSTGRES_DB < src/seeds/development/dump.sql
