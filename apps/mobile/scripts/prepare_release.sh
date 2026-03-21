#!/usr/bin/env bash

set -e

SEMVER_INC=${1:-patch}

git diff --quiet
npm version ${SEMVER_INC}
git add package.json
VERSION=$(node -p "require('./package.json').version")
fastlane ios bump skipCommit:true --env staging
fastlane android bump skipCommit:true --env staging
git commit -m "chore(mobile): prepare release ${VERSION}"
