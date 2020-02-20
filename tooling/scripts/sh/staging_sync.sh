#!/usr/bin/env bash

MACHINE_PRODUCTION=ww-production
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
echo "Creating new partial production dump"
docker-machine ssh ${MACHINE_PRODUCTION} <<END-OF-BACKUP
    PGDUMP_CONTAINER=\$(docker ps -q --filter name=${STACK_NAME}_pgdump)
    IMAGEDUMP_CONTAINER=\$(docker ps -q --filter name=${STACK_NAME}_imagedump)
    docker exec \${PGDUMP_CONTAINER} sh /app/backup_partial.sh
    docker exec \${IMAGEDUMP_CONTAINER} backup.sh
END-OF-BACKUP

#########################################################################
# Step 3: Restore this backup on staging machine                        #
#########################################################################
echo "Restoring staging DB"
docker-machine ssh ${MACHINE_STAGING} <<END-OF-DB-RESTORE
    PGDUMP_CONTAINER=\$(docker ps -q --filter name=${STACK_NAME}_pgdump)
    docker exec \${PGDUMP_CONTAINER} sh /app/restore_partial.sh
END-OF-DB-RESTORE

#########################################################################
# Step 4: Run image restore from production to staging                  #
#########################################################################
echo "Restoring staging images"
docker-machine ssh ${MACHINE_STAGING} <<END-OF-IMAGE-RESTORE
    IMAGEDUMP_CONTAINER=\$(docker ps -q --filter name=${STACK_NAME}_imagedump)
    docker exec -e S3_SUBDIR=production \${IMAGEDUMP_CONTAINER} restore.sh
END-OF-IMAGE-RESTORE
