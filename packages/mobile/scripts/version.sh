#!/usr/bin/env bash

../../../tooling/scripts/sh/changelog.sh
fastlane version
# these files are changed by fastlane version
git add android/app/build.gradle
git add ios/whitewater/Info.plist
git add ios/whitewater-tvOS/Info.plist
git add ios/whitewater-tvOSTests/Info.plist
git add ios/whitewater.xcodeproj/project.pbxproj
git add ios/whitewaterTests/Info.plist
