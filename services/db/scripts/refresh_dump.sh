#!/bin/bash

# This script finds latest backup, downloads it, extracts it into dump folder
# Then dev database can use data from production

set -e

rm -rf config/dump/*

S3_BUCKET=backups.whitewater.guide
S3_PREFIX=v3/
AWS_PROFILE=$1
DUMP_NAME="backup.tar"

LATEST_BACKUP=$(aws s3api list-objects-v2 --bucket "${S3_BUCKET}" --prefix "${S3_PREFIX}backup" --query 'reverse(sort_by(Contents, &LastModified))[:1].Key' --output=text --profile ${AWS_PROFILE})

echo "Fetching ${LATEST_BACKUP} from S3"
aws s3 cp s3://${S3_BUCKET}/${LATEST_BACKUP} --profile ${AWS_PROFILE} config/dump/${DUMP_NAME}
cd config/dump
tar -xvf ${DUMP_NAME}
rm ${DUMP_NAME}
# dev database doesn't use it, because it's too big for tmpfs database
rm gorge.bak
echo "Success"
