#! /bin/sh

if [ -f /docker-entrypoint-initdb.d/wwguide.bak ]; then
    echo "Restoring wwguide dump"
    pg_restore --username "$POSTGRES_USER" -Fc -d wwguide /docker-entrypoint-initdb.d/wwguide.bak
    echo "Success"
fi

if [ -f /docker-entrypoint-initdb.d/gorge_schema.bak ]; then
    echo "Restoring gorge schema dump"
    pg_restore --username "$POSTGRES_USER" -Fc -d gorge /docker-entrypoint-initdb.d/gorge_schema.bak
    psql --username "$POSTGRES_USER" -d gorge -c "INSERT INTO schema_migrations (version, dirty) VALUES (1, false);"
    psql --username "$POSTGRES_USER" -d gorge -c "CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;"
    psql --username "$POSTGRES_USER" -d gorge -c "SELECT create_hypertable('measurements', 'timestamp');"
    if [ -f /docker-entrypoint-initdb.d/measurements.csv ]; then
        psql --username "$POSTGRES_USER" --dbname=gorge -c "\copy measurements FROM '/docker-entrypoint-initdb.d/measurements.csv'"
    fi
    echo "Success"
fi
