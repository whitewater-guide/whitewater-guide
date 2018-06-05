#!/bin/bash
set -e

set -o allexport
source .env
set +o allexport

S3_PREFIX=${1:-production}

LATEST_BACKUP=$(aws s3 ls s3://$S3_BUCKET/$S3_PREFIX/ | sort | tail -n 1 | awk '{ print $4 }')

echo "Fetching ${LATEST_BACKUP} from S3"

aws s3 cp s3://$S3_BUCKET/$S3_PREFIX/${LATEST_BACKUP} config/dump.bak
