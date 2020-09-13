#! /bin/sh

set -e

if [ -f /docker-entrypoint-initdb.d/dump/wwguide.bak ]; then
    echo "[db-dev] Restoring wwguide dump"
    pg_restore --username "$POSTGRES_USER" -Fc -d wwguide /docker-entrypoint-initdb.d/dump/wwguide.bak
    echo "[db-dev] Success"
fi

if [ -f /docker-entrypoint-initdb.d/dump/gorge_schema.bak ]; then
    echo "[db-dev] Restoring gorge schema dump"
    pg_restore --username "$POSTGRES_USER" -Fc -d gorge /docker-entrypoint-initdb.d/dump/gorge_schema.bak
    psql --username "$POSTGRES_USER" -d gorge -c "INSERT INTO schema_migrations (version, dirty) VALUES (1, false);"
    psql --username "$POSTGRES_USER" -d gorge -c "CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;"
    psql --username "$POSTGRES_USER" -d gorge -c "SELECT create_hypertable('measurements', 'timestamp');"
    if [ -f /docker-entrypoint-initdb.d/dump/measurements.csv ]; then
        psql --username "$POSTGRES_USER" --dbname=gorge -c "\copy measurements FROM '/docker-entrypoint-initdb.d/dump/measurements.csv'"
    fi
    echo "[db-dev] Success"
fi

echo "[db-dev] Creating test database"
psql --variable=ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname=$POSTGRES_DB <<-EOSQL
  CREATE DATABASE wwtest;
EOSQL

echo "[db-dev] Installing extensions on test database"
psql --variable=ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname=wwtest <<-EOSQL
  CREATE EXTENSION IF NOT EXISTS "pg_trgm";
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  CREATE EXTENSION IF NOT EXISTS "postgis";
  CREATE EXTENSION IF NOT EXISTS "timescaledb" CASCADE;
EOSQL
