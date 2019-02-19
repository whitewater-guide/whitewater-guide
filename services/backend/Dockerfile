FROM node:8.15.0-alpine

ENV PROJECT_ROOT /opt/app
WORKDIR $PROJECT_ROOT

# curl for healthcheck, also dependencies for hiredis
RUN apk --no-cache add --virtual native-deps \
    g++ gcc libgcc libstdc++ linux-headers make python && \
    apk add --no-cache curl

RUN npm install pm2 -g
RUN chown -R node /opt/app

COPY . /opt/app
RUN cd /opt/app/ && rm -rf node_modules && yarn install --production=true

# Expose pm2 health endpoint
# http://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/#expose-health-endpoint
# Do not expose it via caddy as it spits sensitive data
HEALTHCHECK --timeout=3s --start-period=60s \
  CMD curl -f http://localhost:9615/ || exit 1

RUN apk del native-deps

COPY bin /opt/bin

CMD ["/opt/bin/start_production.sh"]
