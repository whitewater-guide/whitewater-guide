#!/bin/bash
set -e

echo "[initdb] Installing extensions"
psql --variable=ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname=$POSTGRES_DB <<-EOSQL
  CREATE EXTENSION IF NOT EXISTS "pg_trgm";
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  CREATE EXTENSION IF NOT EXISTS "postgis";
  CREATE EXTENSION IF NOT EXISTS "timescaledb" CASCADE;
EOSQL

echo "[initdb] Creating gorge database"
psql --variable=ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname=$POSTGRES_DB <<-EOSQL
  CREATE DATABASE gorge;
EOSQL

echo "[initdb] Updating timescale on $POSTGRES_DB db"
psql --username "$POSTGRES_USER" --dbname=$POSTGRES_DB -X <<-EOSQL
  ALTER EXTENSION timescaledb UPDATE;
EOSQL

echo "[initdb] Updating timescale on gorge db"
psql --username "$POSTGRES_USER" --dbname=gorge -X <<-EOSQL
  ALTER EXTENSION timescaledb UPDATE;
EOSQL
