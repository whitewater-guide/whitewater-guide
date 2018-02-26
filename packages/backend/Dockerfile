FROM keymetrics/pm2:8

ENV PROJECT_ROOT /opt/app

RUN mkdir -p /tmp/app \
 && mkdir -p /opt/app \
 && chown -R node /opt/app

RUN npm install -g chokidar-cli

COPY package.json yarn.lock /tmp/app/

# TODO
# yarn install --production[=true|false]
RUN cd /tmp/app/ && yarn install --ignore-engines

WORKDIR $PROJECT_ROOT

COPY bin /opt/bin

CMD ["/opt/bin/start.sh"]