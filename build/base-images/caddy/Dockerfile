# Builder
FROM abiosoft/caddy:builder as builder

ARG version="0.10.12"
ARG plugins="cache"

RUN VERSION=${version} PLUGINS=${plugins} /bin/sh /usr/bin/builder.sh

# Final stage
FROM alpine:3.7

RUN apk add --no-cache openssh-client ca-certificates curl

# install caddy
COPY --from=builder /install/caddy /usr/bin/caddy

EXPOSE 80 443 2015
VOLUME /root/.caddy /srv
WORKDIR /srv

ENTRYPOINT ["/usr/bin/caddy"]
CMD ["--conf", "/etc/Caddyfile", "--log", "stdout", "--agree"]
