#!/usr/bin/env bash

# Run this script to start local deployment

# Create if necessary
docker-machine create ww-local || true
# Start if not running
docker-machine create ww-local || true
# Prepare
docker-machine ssh ww-local < build/scripts/local_machine_prepare.sh
