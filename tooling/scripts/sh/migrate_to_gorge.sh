#!/usr/bin/env bash

# This scripts is used to migrate from single wwguide database to two databases: gorge and wwguide

set -e

psql --variable=ON_ERROR_STOP=1 --username postgres --dbname=gorge <<-EOSQL
  CREATE EXTENSION postgres_fdw;

  CREATE SERVER wwguide
    FOREIGN DATA WRAPPER postgres_fdw
    OPTIONS (dbname 'wwguide', fetch_size '250000');

  CREATE USER MAPPING for postgres
    SERVER wwguide
    OPTIONS (user 'postgres', password '$POSTGRES_PASSWORD');

  CREATE FOREIGN TABLE fdw_msments
    ("timestamp" timestamptz NOT NULL,
    "script" character varying(255) NOT NULL,
    "code" character varying(255) NOT NULL,
    "flow" real,
    "level" real)
    SERVER wwguide
    OPTIONS (schema_name 'public', table_name 'measurements');

  INSERT INTO measurements (SELECT * FROM fdw_msments) ON CONFLICT DO NOTHING;

  DROP FOREIGN TABLE fdw_msments;
  DROP USER MAPPING FOR postgres SERVER wwguide;
  DROP SERVER wwguide;
EOSQL

psql --username postgres --dbname=wwguide -c "DROP TABLE measurements;"

psql --variable=ON_ERROR_STOP=1 --username postgres --dbname=wwguide <<-EOSQL
  CREATE DATABASE gorge;
EOSQL
