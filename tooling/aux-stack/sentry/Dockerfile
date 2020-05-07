ARG SENTRY_IMAGE
FROM ${SENTRY_IMAGE:-getsentry/sentry:latest}

COPY . /etc/sentry/

ENV DOCKERIZE_VERSION v0.11.0
RUN apt update \
    && apt install -y curl \
    && curl -sfL https://github.com/powerman/dockerize/releases/download/${DOCKERIZE_VERSION}/dockerize-$(uname -s)-$(uname -m) | install /dev/stdin /usr/local/bin/dockerize

# Hook for installing additional plugins
RUN if [ -s /usr/src/sentry/requirements.txt ]; then pip install -r /usr/src/sentry/requirements.txt; fi

ENTRYPOINT ["/usr/local/bin/dockerize", "-template", "/etc/sentry/config.template.yml:/etc/sentry/config.yml", "/docker-entrypoint.sh"]
# ENTRYPOINT exec /docker-entrypoint.sh $0 $@
