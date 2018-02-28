FROM golang:latest

WORKDIR /go/src/github.com/doomsower/whitewater/workers

COPY ./src .

RUN go get -d ./...
RUN CGO_ENABLED=0 GOOS=linux go install -ldflags="-s -w" -a ./...
