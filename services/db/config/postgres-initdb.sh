#!/bin/bash
set -e

psql --variable=ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname=$POSTGRES_DB <<-EOSQL
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  CREATE EXTENSION IF NOT EXISTS "postgis";
  CREATE EXTENSION IF NOT EXISTS "timescaledb" CASCADE;
EOSQL

psql --username "$POSTGRES_USER" --dbname=$POSTGRES_DB -X <<-EOSQL
  ALTER EXTENSION timescaledb UPDATE;
EOSQL
