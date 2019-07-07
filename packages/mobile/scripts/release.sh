#!/usr/bin/env bash

set -e

git diff --quiet
npm version
VERSION=$(node -p "require('./package.json').version")
fastlane ios bump --skipCommit true
fastlane android bump --skipCommit true
node ../../tooling/scripts/bin/changelog.js --path .
git commit -m "chore(mobile): prepare release ${VERSION}"
