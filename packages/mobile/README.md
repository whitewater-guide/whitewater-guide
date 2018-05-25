# Versioning

Top-level project defines git commit hooks that will increment package.json verion number.  
Mobile apps versioning is based on package.json version filed.  It looks like `1.2.8` or `1.2.9-1`.  
The scheme is `<major>.<minor>.<patch>-<build>`  

**Version bumping rules:**
- `major` is bumped manually
- `minor` is bumped manually, when native part (ios, android or both) gets modified
- `patch` is bumped manually, periodically, to refresh js bundle that gets shipped with store version
- `build` is bumped automatically by top-level git commit hooks.

**Android version**
- Fastlane builds android version based on package.json version
- `versionName` has no purpose other than to be displayed to users. 
- `versionName` is `<major>.<minor>.<patch>`
- `versionCode` you can set the value to any integer you want, however you should make sure that each successive release of your app uses a greater value.
- `versionCode` is calculated from minor, major, patch and build number
- For example, for package.json version `1.2.8` `versionCode` will be `100200800`
- For example, for package.json version `1.2.9-1` `versionCode` will be `100200901`
- **Important.** The greatest value Google Play allows for versionCode is 2100000000, which limits us to maximal major version of 99.  

**iOS version**
- Fastlane builds android version based on package.json version
- `Version` is `<major>.<minor>.<patch>`
- `Build` is `<build>`

# Useful links
- [How to setup XCode staging](https://github.com/facebook/react-native/issues/11813#issuecomment-310029148)
