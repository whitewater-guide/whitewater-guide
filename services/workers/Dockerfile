FROM golang:1.11.5-stretch as builder

COPY src /go/src
WORKDIR /go/src

# Install Proj.4 - C library for coordinate system conversion
ENV PROJ4_VERSION=4.9.3
RUN curl -SL http://download.osgeo.org/proj/proj-${PROJ4_VERSION}.tar.gz \
  | tar -xzC /usr/include/
RUN apt-get update \
 && apt-get install libproj12=${PROJ4_VERSION}-1 --yes \
 && ln -s /usr/lib/x86_64-linux-gnu/libproj.so.12 /usr/lib/libproj.so
ENV CGO_CFLAGS="-I/usr/include/proj-${PROJ4_VERSION}/src"

RUN go get -d workers/... cli/... \
 && GOOS=linux go build -o /go/bin/workers-server -ldflags="-s -w" workers \
 && GOOS=linux go build -o /go/bin/workers-cli -ldflags="-s -w" cli

# -------- Runnable ---------
# I couldn't statically link workers with proj4 so they would work on alpine, so here we have debian
FROM debian:stretch-20190122-slim

RUN addgroup --gid 1000 --system workers \
 && adduser --uid 1000 --system workers --gid 1000 \
 && mkdir -p /tmp/cookies \
 && chown -R workers:workers /tmp/cookies

# Install Proj.4 - C library for coordinate system conversion
ENV PROJ4_VERSION=4.9.3
RUN apt-get update \
 && apt-get install libproj12=${PROJ4_VERSION}-1 --yes

USER workers
WORKDIR /app

COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /go/bin/workers-server /go/bin/workers-cli ./
COPY --from=builder /usr/local/go/lib/time/zoneinfo.zip /usr/local/go/lib/time/zoneinfo.zip

ENV PATH="/app:${PATH}"

ENTRYPOINT ["workers-server"]
