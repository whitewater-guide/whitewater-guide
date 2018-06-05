#! /bin/sh

if [ -f /docker-entrypoint-initdb.d/dump.bak ]; then
    echo "Restoring dump"
    psql --username "$POSTGRES_USER" -c "ALTER DATABASE ${POSTGRES_DB} SET timescaledb.restoring='on';"
    psql --username "$POSTGRES_USER" -d $POSTGRES_DB -c "drop schema public cascade; create schema public;"
    pg_restore --username "$POSTGRES_USER" -Fc -d $POSTGRES_DB /docker-entrypoint-initdb.d/dump.bak
    psql --username "$POSTGRES_USER" -c "ALTER DATABASE ${POSTGRES_DB} SET timescaledb.restoring='off';"
fi
