#!/usr/bin/env bash

set -e

SEMVER_INC=${1:-patch}

git diff --quiet
npm version ${SEMVER_INC}
git add package.json
VERSION=$(node -p "require('./package.json').version")
fastlane ios bump skipCommit:true
fastlane android bump skipCommit:true
node ../../tooling/scripts/bin/changelog.js --path .
git commit -m "chore(mobile): prepare release ${VERSION}"
