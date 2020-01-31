FROM timescale/timescaledb-postgis:1.4.1-pg10

ENV TIMESCALEDB_TELEMETRY=off

COPY config/postgres-initdb.sh /docker-entrypoint-initdb.d/initdb.sh
