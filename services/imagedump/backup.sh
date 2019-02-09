#! /bin/sh

set -e

echo "Backing up images from ${S3_SUBDIR} to ${S3_BUCKET}"

for bucket in avatars banners covers media; do

#           --dry-run \
    rclone --config /home/rclone/rclone.conf \
           copy minio:${bucket} s3:${S3_BUCKET}/${S3_SUBDIR}/${bucket}

done
