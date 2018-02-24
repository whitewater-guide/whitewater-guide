### STAGE 1: Build ###
FROM golang:latest as builder

WORKDIR /go/src/github.com/doomsower/whitewater/workers

COPY ./src .

RUN go get -d ./...
RUN CGO_ENABLED=0 GOOS=linux go install -a ./...

### STAGE 2: Setup ###
FROM alpine:latest as runner

WORKDIR /root

COPY --from=builder /go/bin .

CMD ["./galicia", "autofill", "-v"]