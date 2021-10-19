#! /bin/bash

# This script is used to restore production dumps into dev database

set -e

if [ -f /docker-entrypoint-initdb.d/dump/postgres.bak ]; then
    echo "[restore_dump] Restoring postgres dump"
    pg_restore --username "$POSTGRES_USER" --no-owner -Fc -d postgres /docker-entrypoint-initdb.d/dump/postgres.bak || true
    echo "[restore_dump] Success"
fi

if [ -f /docker-entrypoint-initdb.d/dump/wwguide.bak ]; then
    echo "[restore_dump] Restoring wwguide dump"
    pg_restore --username "$POSTGRES_USER" --no-owner -Fc -d wwguide /docker-entrypoint-initdb.d/dump/wwguide.bak || true
    echo "[restore_dump] Success"
fi

# This is too big to fit into tmpfs
# But this code can be used if for some reason you want to use non-tmpfs volumes and use whole database
# if [ -f /docker-entrypoint-initdb.d/dump/gorge.bak ]; then
#     echo "[restore_dump] Restoring gorge dump"
#     pg_restore --username "$POSTGRES_USER" --no-owner -Fc -d gorge /docker-entrypoint-initdb.d/dump/gorge.bak || true
#     echo "[restore_dump] Success"
# fi

if [ -f /docker-entrypoint-initdb.d/dump/gorge_without_measurements.bak ]; then
    echo "[restore_dump] Restoring gorge dump without measurements"
    pg_restore --username "$POSTGRES_USER" -Fc -d gorge /docker-entrypoint-initdb.d/dump/gorge_without_measurements.bak || true
    if [ -f /docker-entrypoint-initdb.d/dump/measurements.csv ]; then
        echo "[restore_dump] copying measurements"
        psql --username "$POSTGRES_USER" --dbname=gorge -c "\copy measurements FROM '/docker-entrypoint-initdb.d/dump/measurements.csv'"
    fi
    echo "[restore_dump] Restored gorge dump without measurements"
fi

# Trying to restore archived partitions from 'archives' dir (files that look like archive.measurements_p2016_12.pgdump)
shopt -s nullglob
for file in /docker-entrypoint-initdb.d/dump/archives/*
do
    echo "[restore_dump] Restoring archive ${file}"
    pg_restore --username "$POSTGRES_USER" -Fc -d gorge ${file} || true
done

echo "[restore_dump] Done"
