FROM jwilder/dockerize

ENV MINIO_HOST=minio
ARG RCLONE_VERSION=v1.42
ARG GOCORN_VERSION=v0.0.7

RUN apk --no-cache add ca-certificates wget \
    && addgroup -g 1001 rclone \
    && adduser -D -u 1001 -G rclone rclone

WORKDIR "/home/rclone"

RUN cd /tmp \
 && wget -qO- https://github.com/odise/go-cron/releases/download/${GOCORN_VERSION}/go-cron-linux.gz | zcat > /usr/local/bin/go-cron \
 && chmod +x /usr/local/bin/go-cron \
 && wget -q https://downloads.rclone.org/${RCLONE_VERSION}/rclone-${RCLONE_VERSION}-linux-amd64.zip \
 && unzip /tmp/rclone-${RCLONE_VERSION}-linux-amd64.zip \
 && mv /tmp/rclone-*-linux-amd64/rclone /usr/local/bin \
 && rm -rf /tmp/rclone* \

USER rclone

COPY rclone.tmpl /home/rclone/
COPY restore.sh backup.sh entrypoint.sh run.sh /usr/local/bin/

ENTRYPOINT ["entrypoint.sh"]
