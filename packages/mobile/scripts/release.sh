#!/usr/bin/env bash

set -e

git diff --quiet
npm version
VERSION=$(node -p "require('./package.json').version")
fastlane ios bump
fastlane android bump
node ../../tooling/scripts/bin/changelog.js --path .
git commit -m "chore(mobile): prepare release ${VERSION}"
