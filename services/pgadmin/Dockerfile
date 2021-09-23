FROM dpage/pgadmin4:5.6

ENV PGADMIN_DEFAULT_EMAIL=user@domain.com
ENV PGADMIN_DEFAULT_PASSWORD=SuperSecret
ENV PGADMIN_CONFIG_CONSOLE_LOG_LEVEL=30
ENV PGADMIN_CONFIG_FILE_LOG_LEVEL=30


COPY ./servers.json /pgadmin4/servers.json

RUN echo 'db:5432:*:postgres:whitewater' > /tmp/pgpassfile && \
    chmod 600 /tmp/pgpassfile
