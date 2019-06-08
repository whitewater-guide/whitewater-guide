FROM sentry:9.1

WORKDIR /usr/src/sentry

# Add WORKDIR to PYTHONPATH so local python files don't need to be installed
ENV PYTHONPATH /usr/src/sentry
COPY config.template.yml sentry.conf.py /etc/sentry/

ENV DOCKERIZE_VERSION v0.11.0
RUN apt update \
 && apt install -y curl \
 && curl -sfL https://github.com/powerman/dockerize/releases/download/${DOCKERIZE_VERSION}/dockerize-$(uname -s)-$(uname -m) | install /dev/stdin /usr/local/bin/dockerize

ENTRYPOINT ["/usr/local/bin/dockerize", "-template", "/etc/sentry/config.template.yml:/etc/sentry/config.yml", "/entrypoint.sh"]