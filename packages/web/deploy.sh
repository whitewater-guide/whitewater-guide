#! /bin/bash

set -e

S3_BUCKET=${1:-admin.whitewater.guide}
AWS_PROFILE=${2:-ww-prod}

aws s3 sync ./build s3://${S3_BUCKET} --profile ${AWS_PROFILE}

DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Aliases.Items[?@=='${S3_BUCKET}']].Id" --output text --profile ${AWS_PROFILE})

echo "DISTRIBUTION_ID=${DISTRIBUTION_ID}"

aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*" --profile ${AWS_PROFILE}
