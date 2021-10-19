#! /bin/bash
set -e

echo "[initdb] Installing extensions"
psql --variable=ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname=postgres <<- SQL
  CREATE EXTENSION IF NOT EXISTS "pg_trgm";
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  CREATE EXTENSION IF NOT EXISTS "postgis";
  CREATE EXTENSION IF NOT EXISTS "fuzzystrmatch";
  CREATE EXTENSION IF NOT EXISTS "postgis_tiger_geocoder";
  CREATE EXTENSION IF NOT EXISTS "postgis_topology";
SQL
# CREATE EXTENSION IF NOT EXISTS "timescaledb" CASCADE;

echo "[initdb] Creating gorge and wwguide databases"
psql --variable=ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname=postgres <<-SQL
  CREATE DATABASE gorge;
  CREATE DATABASE wwguide;
  CREATE DATABASE wwtest;
SQL
