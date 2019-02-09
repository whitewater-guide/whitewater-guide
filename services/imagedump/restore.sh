#! /bin/sh

set -e

echo "Restoring images from ${S3_SUBDIR}"

for bucket in avatars banners covers media; do

#           --dry-run \
    rclone --config /home/rclone/rclone.conf \
           copy s3:${S3_BUCKET}/${S3_SUBDIR}/${bucket} minio:${bucket}

done
