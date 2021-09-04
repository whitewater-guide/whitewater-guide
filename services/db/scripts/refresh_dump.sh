#!/bin/bash

# This script finds latest backup, downloads it, extracts it into dump folder
# Then dev database can use data from production

set -e

rm -rf config/dump/*

S3_BUCKET=$1
AWS_PROFILE=$2
DUMP_NAME="backup.tar"

LATEST_BACKUP=$(aws s3 ls s3://$S3_BUCKET --profile $AWS_PROFILE | sort | tail -n 1 | awk '{ print $4 }')

echo "Fetching ${LATEST_BACKUP} from S3"
aws s3 cp s3://$S3_BUCKET/${LATEST_BACKUP} --profile $AWS_PROFILE config/dump/${DUMP_NAME}
cd config/dump
tar -xvf ${DUMP_NAME}
rm ${DUMP_NAME}
# dev database doesn't use it, because it's too big for tmpfs database
rm config/dump/gorge.bak
echo "Success"
