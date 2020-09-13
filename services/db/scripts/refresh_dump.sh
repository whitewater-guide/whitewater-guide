#!/bin/bash
set -e

set -o allexport
source .env
set +o allexport

rm -rf config/dump/*

S3_PREFIX=$1
DUMP_NAME="backup.tar"

PGDUMP_SERVICE=$(docker-machine ssh ww-${S3_PREFIX} docker service ps wwguide_pgdump --filter="desired-state=running" -q)
PGDUMP_CONTAINER=$(docker-machine ssh ww-${S3_PREFIX} docker ps --filter="name=${PGDUMP_SERVICE}" -q)
CMD="docker-machine ssh ww-${S3_PREFIX} docker exec ${PG_EXTRA} ${PGDUMP_CONTAINER} sh /app/backup_partial.sh"
eval "${CMD}"

LATEST_BACKUP=$(aws2 s3 ls s3://$S3_BUCKET/$S3_PREFIX/ | grep partial | sort | tail -n 1 | awk '{ print $4 }')

echo "Fetching ${LATEST_BACKUP} from S3"
aws2 s3 cp s3://$S3_BUCKET/$S3_PREFIX/${LATEST_BACKUP} config/dump/${DUMP_NAME}
cd config/dump
tar -xvf ${DUMP_NAME}
rm ${DUMP_NAME}
echo "Success"
