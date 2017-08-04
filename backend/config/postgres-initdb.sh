#!/bin/bash
set -e

psql --variable=ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname=$POSTGRES_DB <<-EOSQL
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  CREATE EXTENSION IF NOT EXISTS "postgis";
EOSQL


# TODO: run commands below only in dev environment
psql --variable=ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  CREATE DATABASE "test";
EOSQL

psql --variable=ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname=test <<-EOSQL
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  CREATE EXTENSION IF NOT EXISTS "postgis";
EOSQL

# Ok maybe not this one
psql --variable=ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  ALTER SYSTEM SET log_statement = "all";
EOSQL
