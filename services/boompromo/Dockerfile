FROM ubuntu:18.04 AS dockerizer

RUN apt-get update && apt-get install -y curl

ENV DOCKERIZE_VERSION v0.11.0
RUN curl -sfL https://github.com/powerman/dockerize/releases/download/${DOCKERIZE_VERSION}/dockerize-`uname -s`-`uname -m` | install /dev/stdin /usr/local/bin/dockerize

FROM pierrezemb/gostatic

COPY build /srv/http/
COPY --from=dockerizer /usr/local/bin/dockerize /

ENTRYPOINT ["/dockerize", "-template", "/srv/http/index.html:/srv/http/index.html", "/goStatic"]
