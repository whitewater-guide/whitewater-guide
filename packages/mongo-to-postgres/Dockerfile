FROM golang:latest

WORKDIR /go/src/github.com/doomsower/whitewater/mongo-to-postgres

COPY ./src .

RUN go get -d ./...
RUN CGO_ENABLED=0 GOARCH=amd64 go install -ldflags="-s -w" -a ./...
