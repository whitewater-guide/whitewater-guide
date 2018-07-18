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


if [ "$NODE_ENV" == "development" ]
then

psql --variable=ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  CREATE DATABASE "test";
EOSQL

psql --variable=ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname=test <<-EOSQL
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  CREATE EXTENSION IF NOT EXISTS "postgis";
  CREATE EXTENSION IF NOT EXISTS "timescaledb" CASCADE;
EOSQL

# psql --variable=ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
#  ALTER SYSTEM SET log_statement = "all";
# EOSQL

fi
