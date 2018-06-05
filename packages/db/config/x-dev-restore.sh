#! /bin/sh

if [ -f dump.bak ]; then
    echo "Restoring dump"
    psql --username "$POSTGRES_USER" -c "ALTER DATABASE ${$POSTGRES_DB} SET timescaledb.restoring='on';"
    psql $POSTGRES_HOST_OPTS -d $POSTGRES_DB -c "drop schema public cascade; create schema public;"
    pg_restore $--username "$POSTGRES_USER" -Fc -d $POSTGRES_DB dump.bak
    psql --username "$POSTGRES_USER" -c "ALTER DATABASE ${$POSTGRES_DB} SET timescaledb.restoring='off';"
fi
