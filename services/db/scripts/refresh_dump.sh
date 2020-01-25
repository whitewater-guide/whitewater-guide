#!/bin/bash
set -e

set -o allexport
source .env
set +o allexport

rm -rf config/*.bak

S3_PREFIX="production"
DUMP_NAME="dump.bak"
PG_EXTRA=

while [[ $# -gt 0 ]]
do
    key="${1}"
    case ${key} in
    -e|--env)
        S3_PREFIX="${2}"
        shift # past argument
        shift # past value
        ;;
    -s|--skip-measurements)
        PG_EXTRA="POSTGRES_EXTRA_OPTS=--exclude-table-data='public.measurements'\ --exclude-table-data='_timescaledb*'\ --exclude-table='_timescaledb_internal._hyper*'"
        PG_EXTRA="-e \"${PG_EXTRA}\""
        shift # past argument
        ;;
    *)    # unknown option
        shift # past argument
        ;;
    esac
#    shift
done

# Make dump without measurements
PGDUMP_SERVICE=$(docker-machine ssh ww-${S3_PREFIX} docker service ps wwguide_pgdump --filter="desired-state=running" -q)
PGDUMP_CONTAINER=$(docker-machine ssh ww-${S3_PREFIX} docker ps --filter="name=${PGDUMP_SERVICE}" -q)
CMD="docker-machine ssh ww-${S3_PREFIX} docker exec ${PG_EXTRA} ${PGDUMP_CONTAINER} sh backup.sh"
eval "${CMD}"

LATEST_BACKUP=$(aws2 s3 ls s3://$S3_BUCKET/$S3_PREFIX/ | sort | tail -n 1 | awk '{ print $4 }')

echo "Fetching ${LATEST_BACKUP} from S3"

aws2 s3 cp s3://$S3_BUCKET/$S3_PREFIX/${LATEST_BACKUP} config/${DUMP_NAME}
