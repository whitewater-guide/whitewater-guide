#! /bin/sh

set -e

dockerize -template rclone.tmpl:rclone.conf -wait http://${MINIO_HOST}:${MINIO_PORT}/minio/health/live run.sh