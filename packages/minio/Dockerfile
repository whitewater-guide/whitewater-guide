FROM minio/minio:latest

ARG SEEDS=empty.tar.gz
COPY ./bin/seed_and_run.sh /usr/bin/
ADD $SEEDS /tmp/

ENTRYPOINT ["/usr/bin/seed_and_run.sh"]
