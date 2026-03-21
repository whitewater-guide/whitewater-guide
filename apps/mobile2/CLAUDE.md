# mobile2

React Native 0.84 app.

## Native build validation

After modifying native files, validate builds from this directory (exit code 0 = success):

- **`ios/` changed**: `pnpm react-native build-ios`
- **`android/` changed**: `pnpm react-native build-android`
- **New native dependency** in `package.json`: validate **both** platforms

## Installing dependencies

- Always use `--ignore-scripts` flag when installing pnpm dependencies (e.g. `pnpm add --ignore-scripts <package>`)
- After installing dependencies, verify they appear in the corresponding `package.json` before proceeding
