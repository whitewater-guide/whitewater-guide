FROM golang:latest as builder

WORKDIR /go/src
ENV GOBIN=/go/bin
COPY ./src .

RUN mkdir -p /go/bin \
 && go get -d ./... \
 && CGO_ENABLED=0 GOOS=linux go install -ldflags="-s -w" -a ./main.go

# -------- Runnable ---------
FROM alpine:latest

WORKDIR /root
COPY --from=builder /go/bin/main workers

ENTRYPOINT ["/root/workers"]
