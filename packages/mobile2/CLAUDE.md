# mobile2

React Native 0.84 app.

## Native build validation

After modifying native files, validate builds from this directory (exit code 0 = success):

- **`ios/` changed**: `pnpm react-native build-ios`
- **`android/` changed**: `pnpm react-native build-android`
- **New native dependency** in `package.json`: validate **both** platforms
