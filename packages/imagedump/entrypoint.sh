#! /bin/sh

set -e

dockerize -template rclone.tmpl:rclone.conf -wait http://${MINIO_HOST}:9000/minio/health/live run.sh