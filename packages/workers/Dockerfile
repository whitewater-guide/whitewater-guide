FROM golang:latest as builder

COPY ./src /go/src
WORKDIR /go/src

RUN go get -d workers/... cli/... \
 && CGO_ENABLED=0 GOOS=linux go build -o /go/bin/workers-server -ldflags="-s -w" workers \
 && CGO_ENABLED=0 GOOS=linux go build -o /go/bin/workers-cli -ldflags="-s -w" cli

# -------- Runnable ---------
FROM alpine:latest

WORKDIR /root
COPY --from=builder /go/bin/workers-server /go/bin/workers-cli ./
COPY --from=builder /usr/local/go/lib/time/zoneinfo.zip /usr/local/go/lib/time/zoneinfo.zip

ENTRYPOINT ["/root/workers-server"]
