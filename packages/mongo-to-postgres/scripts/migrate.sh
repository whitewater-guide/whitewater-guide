#!/usr/bin/env bash

# This is WIP - need to connect this to mongo and postgres networks
docker run --rm --name ww_imgration ww-migration:latest /go/bin/mongo-to-postgres
