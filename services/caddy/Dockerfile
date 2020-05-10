FROM golang:1.13-alpine as builder
RUN apk add --no-cache git gcc musl-dev
RUN mkdir /www /caddy
COPY ./builder.sh /usr/bin/builder.sh
ARG version="1.0.5"
ARG enable_telemetry="true"
RUN VERSION=${version} /bin/sh /usr/bin/builder.sh


FROM alpine:3.11.6

ARG version="1.0.5"

ENV ACME_AGREE="true"
ENV ENABLE_TELEMETRY="false"

RUN apk add --no-cache openssh-client ca-certificates git mailcap tzdata

# install caddy
COPY --from=builder /install/caddy /usr/bin/caddy

WORKDIR /srv

COPY Caddyfile caddy-common.conf /etc/
COPY subdomains /etc/subdomains

ENTRYPOINT ["caddy"]
CMD ["--conf", "/etc/Caddyfile", "--log", "stdout", "--agree=$ACME_AGREE"]
