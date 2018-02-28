# Dockerfile based on https://github.com/abiosoft/caddy-docker/blob/master/Dockerfile
# All that fuss is needed to install cache plugin for caddy

# Builder
FROM abiosoft/caddy:builder as builder

ARG version="0.10.11"
ARG plugins="cache"

RUN VERSION=${version} PLUGINS=${plugins} /bin/sh /usr/bin/builder.sh

# Final stage
FROM alpine:3.6

RUN apk add --no-cache openssh-client git

# install caddy
COPY --from=builder /install/caddy /usr/bin/caddy

EXPOSE 80 443 2015
VOLUME /root/.caddy /srv
WORKDIR /srv

COPY Caddyfile /etc/Caddyfile

ENTRYPOINT ["/usr/bin/caddy"]
CMD ["--conf", "/etc/Caddyfile", "--log", "stdout"]
