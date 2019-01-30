# Versioning

Mobile apps versioning is based on package.json version filed. It looks like `1.2.8`.  
The scheme is `<major>.<minor>.<patch>`
Version in `package.json` is incremented using lerna.

File `app.json` has ios and android persistent build numbers `<androidBuildNumber>` and `<iosBuildNumber>`.

**Version bumping rules:**

- `major` is bumped with lerna
- `minor` is bumped with lerna, when native part (ios, android or both) gets modified
- `patch` is bumped with lerna, periodically, to refresh js bundle that gets shipped with store version
- `androidBuildNumber` is incremented by lerna postversion hook
- `iosBuildNumber` is incremented by lerna postversion hook

**Android version**

- Fastlane builds android version based on package.json version
- `versionName` has no purpose other than to be displayed to users.
- `versionName` is `<major>.<minor>.<patch>`
- `versionCode` you can set the value to any integer you want, however you should make sure that each successive release of your app uses a greater value.
- `versionCode` is `androidBuildNumber` from `app.json`

**iOS version**

- Fastlane builds android version based on package.json version
- `Version` is `<major>.<minor>.<patch>`
- `Build` is `iosBuildNumber` from `app.json`
- After appstore verion gets approved for sale, `<patch>` (or even `<minor>`) should be bumped, and `<iosBuildNumber>` can be reset to zero

# Useful links

- [How to setup XCode staging](https://github.com/facebook/react-native/issues/11813#issuecomment-310029148)
