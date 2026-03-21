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

## Navigation

See [Navigation Guidelines](docs/NAVIGATION_GUIDELINES.md) for rules on how to define navigation screens and actions.

## E2E Tests

See [E2E Navigation Test Guidelines](e2e/navigation/GUIDELINES.md) for principles on writing navigation E2E tests.
