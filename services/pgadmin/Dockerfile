FROM dpage/pgadmin4:6

ENV PGADMIN_DEFAULT_EMAIL=user@domain.com
ENV PGADMIN_DEFAULT_PASSWORD=SuperSecret
ENV PGADMIN_CONFIG_CONSOLE_LOG_LEVEL=30
ENV PGADMIN_CONFIG_FILE_LOG_LEVEL=30

COPY ./servers.json /pgadmin4/servers.json

# read https://stackoverflow.com/questions/66578506/where-is-the-pgpass-file-in-pgadmin4-docker-container-when-this-file-is-mounted for explanation
ENV PGPASS_DIR=/var/lib/pgadmin/storage/user_domain.com
RUN mkdir -p -m 700 ${PGPASS_DIR} \
    && echo 'db:5432:*:postgres:whitewater' > ${PGPASS_DIR}/pgpass \
    && chmod 600 ${PGPASS_DIR}/pgpass
# && chown -R pgadmin:pgadmin ${PGPASS_DIR}
