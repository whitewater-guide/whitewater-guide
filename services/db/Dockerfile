FROM timescale/timescaledb-postgis:1.6.0-pg11

ENV TIMESCALEDB_TELEMETRY=off

COPY config/postgres-initdb.sh /docker-entrypoint-initdb.d/initdb.sh
