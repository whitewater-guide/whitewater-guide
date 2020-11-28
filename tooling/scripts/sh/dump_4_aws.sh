#!/usr/bin/env bash

MACHINE_PRODUCTION=ww-production
STACK_NAME=wwguide
BACKUP_BUCKET=backup.whitewater.guide

#########################################################################
# Step 1: load env file with postgres password                          #
#########################################################################
set -o allexport
source config/.env.staging
set +o allexport

#########################################################################
# Step 2: Make ww-production machine produce unscheduled dump.          #
# It will be uploaded to s3.                                            #
#########################################################################
echo "Creating new production dump 4 aws"
docker-machine ssh ${MACHINE_PRODUCTION} <<END-OF-BACKUP
    PGDUMP_CONTAINER=\$(docker ps -q --filter name=${STACK_NAME}_pgdump)
    docker exec \${PGDUMP_CONTAINER} sh /app/backup_aws.sh
END-OF-BACKUP
