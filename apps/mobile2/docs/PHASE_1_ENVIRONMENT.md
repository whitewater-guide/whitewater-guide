# Phase 1: Environment & Tooling Setup

**Goal:** Developer workstation ready, empty RN 0.84.1 app running on both platforms.

---

## 1.1 — Install required tools

| Tool                           | Purpose                      | Install                                      |
| ------------------------------ | ---------------------------- | -------------------------------------------- |
| Node.js                        | Runtime (see `.nvmrc`)       | `nvm install` / `nvm use`                    |
| pnpm                           | Package manager              | Already installed (monorepo)                 |
| Xcode 16+                      | iOS builds                   | App Store                                    |
| Android Studio + SDK 35        | Android builds               | Already installed, verify SDK level          |
| Java 17 (Azul Zulu or Temurin) | Android Gradle builds        | `brew install --cask zulu17`                 |
| CocoaPods                      | iOS native deps              | `gem install cocoapods` (or bundler)         |
| Watchman                       | File watching for Metro      | `brew install watchman`                      |
| React Native CLI               | Project init                 | `npx @react-native-community/cli@latest`     |
| React Native DevTools          | Debugging (replaces Flipper) | Built into RN 0.84 — launch via `j` in Metro |
| Detox                          | Gray-box E2E testing         | `pnpm add -D detox @types/detox`             |

**Note on Flipper:** Flipper is **deprecated** as of RN 0.73+. React Native DevTools (built-in) replaces it. It provides:

- Component inspector
- Network inspector
- Console logs
- React DevTools integration
- Launch via pressing `j` in the Metro terminal

## 1.2 — Initialize RN 0.84.1 project

```bash
cd apps/
npx @react-native-community/cli@latest init mobile2 --version 0.84.1 --pm pnpm --skip-install
```

Then:

- Update `package.json`: set name to `@whitewater-guide/mobile`, mark as private
- Configure as pnpm workspace member (add to root `pnpm-workspace.yaml`)
- Set up `tsconfig.json` extending root, with `~` path alias to `src/`
- Configure Metro for monorepo symlinks (may still need `@rnx-kit` or RN 0.84's built-in symlink support)
- Set up Babel with `module-resolver` for `~` alias
- Configure Android bundle IDs: `guide.whitewater.staging` (debug/staging), `guide.whitewater` (release)
- Configure iOS bundle ID: `guide.whitewater`
- Set min iOS deployment target: 15.1 (RN 0.84 minimum)
- Set Android minSdk: 24, targetSdk/compileSdk: 35
- Enable New Architecture (default in 0.84)

## 1.3 — Configure environment variables

Replace `react-native-ultimate-config` (abandoned) with `react-native-config`:

- Create `.env.development`, `.env.staging`, `.env.production`, `.env.test`
- Same variables as old app: `ENV_NAME`, `BACKEND_PROTOCOL`, `BACKEND_HOST`, `DEEP_LINKING_DOMAIN`, `STATIC_CONTENT_URL_BASE`, `CHAT_HOST`, `MAPBOX_ACCESS_TOKEN`, `MAPBOX_DOWNLOADS_TOKEN`, `SENTRY_DSN`
- Remove `FACEBOOK_APP_ID` (social auth dropped)

## 1.4 — Set up dev tooling

| Tool        | Config                                                                |
| ----------- | --------------------------------------------------------------------- |
| TypeScript  | Strict mode, `tsconfig.json` extending root                           |
| ESLint      | Extend `@whitewater-guide/eslint-config`                              |
| Prettier    | Use root config                                                       |
| lint-staged | Use root husky hooks                                                  |
| Jest        | `react-native` preset, `ts-jest`, `@testing-library/react-native` v13 |
| Detox       | Gray-box E2E test framework — `e2e/` directory for test files         |

**Note:** Storybook setup is deferred to Phase 3 (Dependency Integration) where it will be used for smoke-testing deps.

### Detox setup

1. Install: `pnpm add -D detox @types/detox jest-circus`
2. Install Detox CLI globally: `pnpm add -g detox-cli`
3. Initialize config: `detox init` (creates `.detoxrc.js` and `e2e/` directory)
4. Configure `.detoxrc.js` with:
   - iOS simulator config (iPhone 16, iOS 18)
   - Android emulator config (Pixel 7, API 35)
   - Build commands for both platforms (debug configuration)
5. Tests written as Jest files in `e2e/` (e.g., `e2e/app-launches.test.ts`)
6. Run: `detox build -c ios.sim.debug && detox test -c ios.sim.debug`

### Why Detox over Maestro

- **Gray-box testing** — synchronizes with RN internals (animations, network, bridge idle), reducing flakiness
- **Built for React Native** — by Wix, widely adopted in the RN community
- **JS-based tests** — same language as the app, can share constants/enums/types
- **App state control** — can mock network, handle deep links programmatically
- **Better for complex interactions** — maps, bottom sheets, gestures

## 1.5 — Validation

- [ ] `pnpm install` succeeds from monorepo root
- [ ] `pnpm typecheck` passes for mobile2
- [ ] App builds and runs on iOS simulator (blank screen OK)
- [ ] App builds and runs on Android emulator (blank screen OK)
- [ ] React Native DevTools connects (`j` in Metro)
- [ ] `pnpm test` runs Jest with zero tests (no failures)
- [ ] Detox builds and runs a basic launch test: `detox test -c ios.sim.debug e2e/app-launches.test.ts`
