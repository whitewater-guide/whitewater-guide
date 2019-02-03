#!/usr/bin/env bash

PACKAGE_NAME=$(node -p -e "require('./package.json').name")
./../../node_modules/.bin/conventional-changelog -r 1 --preset angular --infile CHANGELOG.md --same-file --lerna-package ${PACKAGE_NAME} --commit-path $PWD && git add CHANGELOG.md
