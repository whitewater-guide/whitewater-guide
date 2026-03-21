#! /bin/bash

set -e

S3_BUCKET=${1:-whitewater.guide}
AWS_PROFILE=${2:-ww-prod}

aws s3 sync ./src s3://${S3_BUCKET} --profile ${AWS_PROFILE}
aws s3 cp --recursive ./node_modules/@whitewater-guide/translations/assets/html s3://${S3_BUCKET} --profile ${AWS_PROFILE}

DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Aliases.Items[?@=='${S3_BUCKET}']].Id" --output text --profile ${AWS_PROFILE})

echo "DISTRIBUTION_ID=${DISTRIBUTION_ID}"

aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*" --profile ${AWS_PROFILE}
