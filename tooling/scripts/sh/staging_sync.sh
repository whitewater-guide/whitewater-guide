#!/usr/bin/env bash

MACHINE_PREFIX=ww-production
MACHINE_STAGING=ww-staging
STACK_NAME=wwguide
S3_ACCESS_KEY_ID=$(aws configure get default.aws_access_key_id)
S3_SECRET_ACCESS_KEY=$(aws configure get default.aws_secret_access_key)
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
docker-machine ssh ${MACHINE_PRODUCTION} <<END-OF-BACKUP
    PGDUMP_CONTAINER=\$(docker ps -q --filter name=${STACK_NAME}_pgdump)
    IMAGEDUMP_CONTAINER=\$(docker ps -q --filter name=${STACK_NAME}_imagedump)
    docker exec \${PGDUMP_CONTAINER} sh /backup.sh
    docker exec \${IMAGEDUMP_CONTAINER} backup.sh
END-OF-BACKUP

#########################################################################
# Step 3: Restore this backup on staging machine                        #
#########################################################################
docker-machine ssh ${MACHINE_STAGING} <<END-OF-DB-RESTORE
    docker run -e S3_ACCESS_KEY_ID=${S3_ACCESS_KEY_ID} \
               -e S3_SECRET_ACCESS_KEY=${S3_SECRET_ACCESS_KEY} \
               -e S3_BUCKET=${BACKUP_BUCKET} \
               -e S3_PREFIX=production \
               -e S3_REGION=eu-central-1 \
               -e POSTGRES_DATABASE=${POSTGRES_DB} \
               -e POSTGRES_USER=postgres \
               -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
               -e POSTGRES_HOST=db \
               --network wwguide_default \
               doomsower/postgres-restore-s3:latest
END-OF-DB-RESTORE

#########################################################################
# Step 4: Run image restore from production to staging                  #
#########################################################################
docker-machine ssh ${MACHINE_STAGING} <<END-OF-IMAGE-RESTORE
    IMAGEDUMP_CONTAINER=\$(docker ps -q --filter name=${STACK_NAME}_imagedump)
    docker exec -e S3_SUBDIR=production \${IMAGEDUMP_CONTAINER} restore.sh
END-OF-IMAGE-RESTORE
