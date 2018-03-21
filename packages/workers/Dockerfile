FROM golang:latest as builder

COPY ./src /go/src
WORKDIR /go/src

RUN go get -d workers/... cli/... \
 && CGO_ENABLED=0 GOOS=linux go build -o /go/bin/workers-server -ldflags="-s -w" workers \
 && CGO_ENABLED=0 GOOS=linux go build -o /go/bin/workers-cli -ldflags="-s -w" cli

# -------- Runnable ---------
FROM alpine:3.7

RUN addgroup -g 1000 -S workers \
 && adduser -u 1000 -S workers -G workers \
 && mkdir -p /tmp/cookies \
 && chown -R workers:workers /tmp/cookies

USER workers
WORKDIR /app

COPY --from=builder /go/bin/workers-server /go/bin/workers-cli ./
COPY --from=builder /usr/local/go/lib/time/zoneinfo.zip /usr/local/go/lib/time/zoneinfo.zip

ENV PATH="/app:${PATH}"

ENTRYPOINT ["workers-server"]
