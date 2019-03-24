# Based on https://github.com/abiosoft/caddy-docker/blob/master/Dockerfile-no-stats
# to include ratelimit plugin
#
# Builder
#
FROM abiosoft/caddy:builder as builder

ARG version="0.11.5"
ARG plugins="ratelimit"

# process wrapper
RUN go get -v github.com/abiosoft/parent

RUN VERSION=${version} PLUGINS=${plugins} ENABLE_TELEMETRY=false /bin/sh /usr/bin/builder.sh

#
# Final stage
#
FROM alpine:3.8

ARG version="0.11.5"
LABEL caddy_version="$version"

# Let's Encrypt Agreement
ENV ACME_AGREE="true"

# Telemetry Stats
ENV ENABLE_TELEMETRY="false"

RUN apk add --no-cache openssh-client ca-certificates

# install caddy
COPY --from=builder /install/caddy /usr/bin/caddy

WORKDIR /srv

COPY Caddyfile caddy-common.conf /etc/
COPY subdomains /etc/subdomains

# install process wrapper
COPY --from=builder /go/bin/parent /bin/parent

ENTRYPOINT ["/bin/parent", "caddy"]
CMD ["--conf", "/etc/Caddyfile", "--log", "stdout", "--agree=$ACME_AGREE"]
