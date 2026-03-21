# Mobile Package Overview

React Native app for whitewater.guide — a whitewater sports platform. Version 1.21.1, package name `@whitewater-guide/mobile` (private, not published).

## Core Libraries & Versions

| Library                      | Version         | Purpose                          |
| ---------------------------- | --------------- | -------------------------------- |
| React Native                 | 0.72.6          | Core framework                   |
| React                        | 18.2.0          | UI library                       |
| Hermes                       | 0.72.6          | JS engine                        |
| react-navigation             | 6.x             | Navigation (stack, drawer, tabs) |
| @rnmapbox/maps               | 10.0.15         | Mapbox GL maps                   |
| @react-native-firebase/\*    | 14.12.0         | Analytics & push notifications   |
| @apollo/client               | 3.8.6           | GraphQL client                   |
| react-native-paper           | 5.11.1          | Material Design UI (MD2)         |
| react-native-reanimated      | 3.5.4           | Animations                       |
| formik                       | 2.4.5           | Form state management            |
| yup                          | 1.3.2           | Validation schemas               |
| i18next / react-i18next      | 23.6.0 / 13.3.1 | Internationalization             |
| @sentry/react-native         | 5.12.0          | Error tracking                   |
| react-native-iap             | 12.11.0         | In-app purchases                 |
| matrix-js-sdk                | 29.1.0          | Chat (Matrix protocol)           |
| victory-native               | 36.6.11         | Charts                           |
| react-native-mmkv-storage    | 0.9.1           | Fast key-value storage           |
| @turf/\*                     | 6.5.0           | Geospatial calculations          |
| react-native-bundle-splitter | 2.2.3           | Lazy screen loading              |

---

## Monorepo Integration

### Workspace Dependencies

The app consumes four workspace packages via `workspace:*` protocol:

| Package                        | What it provides                                                                                |
| ------------------------------ | ----------------------------------------------------------------------------------------------- |
| `@whitewater-guide/clients`    | Apollo cache policies, auth service base, hooks, chart/map/section utilities, GraphQL fragments |
| `@whitewater-guide/schema`     | Generated GraphQL types, fragments, document nodes, shared `.graphql` schema files              |
| `@whitewater-guide/commons`    | Shared constants (`PASSWORD_MIN_SCORE`, `ApolloErrorCodes`), auth request/response types        |
| `@whitewater-guide/validation` | Yup validation schemas and extensions                                                           |

Also depends on `@whitewater-guide/translations` (npm, not workspace) and `@whitewater-guide/react-native-fast-image` (custom fork of react-native-fast-image).

### How Monorepo Resolution Works

The monorepo was set up when RN monorepo support was poor. The solution relies on:

1. **Hoisted `node_modules`**: `.npmrc` sets `node-linker=hoisted`, so all deps are in root `node_modules/`. Workspace packages become symlinks there (e.g., `node_modules/@whitewater-guide/clients` → `../../packages/clients`).

2. **`@rnx-kit` toolchain** (the key workaround):
   - `@rnx-kit/metro-config` — generates Metro config compatible with RN 0.72
   - `@rnx-kit/metro-resolver-symlinks` — **critical**: makes Metro follow symlinks to workspace packages. Without this, Metro cannot resolve `@whitewater-guide/*` imports.
   - `@rnx-kit/babel-preset-metro-react-native` — Babel preset that handles workspace source files

3. **`react-native` field in `package.json`**: Packages like `clients` and `commons` declare a `"react-native": "src/index.ts"` field, so Metro resolves directly to TypeScript source (not built output). This gives better tree-shaking and avoids needing to rebuild workspace packages during development. Packages without this field (`schema`, `validation`) are consumed from their `dist/` builds.

4. **`module-resolver` Babel plugin**: Resolves `~` path alias to `./src` at build time.

5. **Postinstall workaround**: `scripts/postinstall.sh` removes the `browser` field from `matrix-js-sdk/package.json` in root `node_modules/` to prevent Metro from resolving browser-specific code.

### metro.config.js

```js
const { makeMetroConfig } = require('@rnx-kit/metro-config');
const MetroSymlinksResolver = require('@rnx-kit/metro-resolver-symlinks');

module.exports = makeMetroConfig({
  resolver: { resolveRequest: MetroSymlinksResolver() },
});
```

### babel.config.js

```js
module.exports = {
  presets: ['@rnx-kit/babel-preset-metro-react-native'],
  plugins: [
    './scripts/babel', // injects PJSON_VERSION constant
    ['module-resolver', { alias: { '~': './src' } }],
    'lodash', // tree-shaking
    'react-native-reanimated/plugin', // must be last
  ],
};
```

---

## Native Code

### iOS (`ios/`)

**Min deployment target**: iOS 12.4 | **Bundle ID**: `guide.whitewater`

**Build configurations**: Debug, Staging (release-mode, staging env), Release

**Standard RN 0.72 template code** (unchanged):

- `main.m` — UIApplicationMain entry
- `AppDelegate.h/mm` — RCTAppDelegate subclass structure
- Bundle loading (dev server for Debug, `main.jsbundle` for Release)

**Custom additions beyond template**:

- **Firebase**: `[FIRApp configure]` in AppDelegate before RN initialization
- **Facebook SDK**: `FBSDKApplicationDelegate` initialization + URL handler for OAuth callbacks
- **RNBootSplash**: Custom `BootSplash.storyboard` splash screen (blue background #0078B4 with centered logo)
- **Staging build config**: Added third Xcode configuration mapped to `:release` in Podfile
- **Code signing**: Manual signing via Fastlane Match. Dev profile: `match Development guide.whitewater`, AppStore: `match AppStore guide.whitewater`
- **Deep linking**: Universal links for `whitewater.guide`, `app.whitewater.guide`, `whitewater-dev.com` via Associated Domains entitlement + `RCTLinkingManager` in URL/UserActivity handlers
- **Entitlements**: Apple Sign In, APS (push notifications), Associated Domains
- **Permissions**: Camera, Photo Library, Location (always + when-in-use)
- **Fonts**: MaterialIcons.ttf, MaterialCommunityIcons.ttf bundled
- **Facebook config**: App ID, client token, URL schemes in Info.plist via build variables `$(FACEBOOK_APP_ID)` etc.
- **Swift bridging**: Empty `dummy.swift` + `whitewater-Bridging-Header.h` to enable Swift compilation for native dependencies
- **Localization**: `en.lproj/`, `ru.lproj/` for native strings
- **Podfile hacks**:
  - `$RNMapboxMaps.pre_install()` / `.post_install()` hooks for Mapbox native linking
  - `__apply_Xcode_12_5_M1_post_install_workaround` for Apple Silicon builds
  - Flipper configured across all three build configs
  - `$RNFirebaseAnalyticsWithoutAdIdSupport = true` (no Ad ID tracking)

**No custom native modules on iOS** — all native functionality comes from third-party pods.

### Android (`android/`)

**Min SDK**: 23 | **Target/Compile SDK**: 33 | **NDK**: 23.1.7779620

**Build types**: debug (`guide.whitewater.staging`), releaseStaging (`guide.whitewater.staging`), release (`guide.whitewater`)

**Standard RN 0.72 template code** (mostly unchanged):

- `MainApplication.java` — ReactApplication with SoLoader, Hermes
- `MainActivity.java` — ReactActivity
- `settings.gradle` — standard `@react-native-community/cli-platform-android` native module discovery
- Flipper debug/release split (three variants: debug, release, releaseStaging)

**Custom additions beyond template**:

- **Custom native view: `SectionItemViewManager`** — the only custom native module. Renders river section list items natively (72dp layout with difficulty badge, river/section names, star rating, flow data, lock icon for premium). Registered as `RNSectionItem` React component via `SectionItemPackage`. Uses Unicode symbols for stars and lock icons.
- **RNBootSplash**: `RNBootSplash.init(this)` in `MainActivity.onCreate()`, custom `BootTheme` style
- **Deep linking**: App Links with `autoVerify` for `@string/DEEP_LINKING_DOMAIN`, `singleTask` launch mode
- **Firebase**: Messaging + analytics metadata in manifest, custom notification icon
- **Facebook SDK**: ApplicationId and ClientToken in manifest via string resources
- **Portrait lock**: `android:screenOrientation="portrait"`
- **Mapbox Maven auth**: Private repository in `build.gradle` authenticated via `MAPBOX_DOWNLOADS_TOKEN` from `local.properties`
- **react-native-ultimate-config**: `UltimateConfigModule.setBuildConfig(BuildConfig.class)` for env var injection
- **react-native-iap**: `missingDimensionStrategy 'store', 'play'` (Google Play only)
- **dexcount plugin**: Method count tracking
- **ProGuard rules**: Keep rules for react-native-iap, fast-image (Glide), SVG, ultimate-config, reanimated, device-info, Hermes, Flipper
- **Permissions**: Internet, billing, boot completed, vibrate, network state, fine location (removed: READ_PHONE_STATE, AD_ID)
- **Multi-arch**: Builds for armeabi-v7a, arm64-v8a, x86, x86_64

---

## Build & Release Process

### Fastlane

All builds are **manual**, triggered locally — no CI/CD pipelines (no GitHub Actions, no CircleCI).

**Fastlane plugins**: `aws_s3`, `property_file_read`, `versioning_android`, `versioning_ios`

**Lanes**:

| Lane                 | What it does                                                                                   |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| `ios staging`        | Match certs → bump build number → build Staging config → upload to TestFlight                  |
| `ios production`     | Match certs → bump build number → build Release config → upload to TestFlight (production)     |
| `android staging`    | Bump build number → assemble APK (releaseStaging) → upload to S3 (`binaries.whitewater.guide`) |
| `android production` | Bump build number → bundle AAB (release) → upload to Google Play Store (production track)      |

**Release workflow** (`pnpm release`):

1. `scripts/prepare_release.sh` bumps semver in `package.json` (default: patch)
2. Fastlane `ios bump` + `android bump` update build numbers in `app.json` and native files
3. Creates unified commit: `chore(mobile): prepare release {VERSION}`
4. Developer manually runs `pnpm ios:staging` / `pnpm android:staging` etc.

**Fastlane hooks**:

- `before_all`: Generates env config via `pnpm rnuc` (react-native-ultimate-config)
- `after_all`: Resets to development env via `pnpm setup-dev-env`
- `error` (iOS): Restores backed-up plist files on failure

**iOS code signing**: Fastlane Match with a private GitHub repo (`doomsower/fastlane-match`) for certificates and provisioning profiles.

**Commit convention**: `chore(mobile): [platform] [target] [version]@[build_number]`

### Version Management

- **Semver** (`1.21.1`): stored in `package.json`, synced to `Info.plist` and `build.gradle`
- **iOS build number** (`355`): stored in `app.json` as `iosBuildNumber`, incremented per build
- **Android version code** (`1817096202`): stored in `app.json` as `androidBuildNumber`, incremented per build

---

## Environment Config & Secrets

### Environment Configuration

Uses `react-native-ultimate-config` (RNUC) to inject environment variables into native builds.

**YAML env files** (`.env.{environment}.yml`):

| File                   | Environment | Backend                             |
| ---------------------- | ----------- | ----------------------------------- |
| `.env.development.yml` | Development | `https://api.whitewater.guide`      |
| `.env.staging.yml`     | Staging/QA  | Same as production                  |
| `.env.production.yml`  | Production  | Same endpoints                      |
| `.env.test.yml`        | Jest tests  | Placeholder values with `__` prefix |

**Variables defined**: `ENV_NAME`, `E2E_MODE`, `BACKEND_PROTOCOL`, `BACKEND_HOST`, `DEEP_LINKING_DOMAIN`, `FACEBOOK_APP_ID`, `FACEBOOK_CUSTOM_URL_SCHEME`, `FACEBOOK_CLIENT_TOKEN`, `STATIC_CONTENT_URL_BASE`, `CHAT_HOST`, `MAPBOX_ACCESS_TOKEN`, `MAPBOX_DOWNLOADS_TOKEN`, `SENTRY_DSN`

**Generated outputs** (gitignored, not committed):

- iOS: `ios/rnuc.xcconfig` — Xcode build settings
- Android: Injected into `BuildConfig` class

### Secrets Storage

**In tracked files** (NOT encrypted):

- `fastlane/.env.staging` and `.env.production` — Gradle keystore passwords, Match password, Apple app-specific password, Apple account credentials
- `android/sentry.properties` and `ios/sentry.properties` — Sentry auth tokens
- `android/google_service_account_key.json` — Google Cloud service account for Play Store API
- `ios/whitewater/GoogleService-Info.plist` — Firebase iOS config
- `.env.*.yml` files — Facebook tokens, Mapbox tokens, Sentry DSN

**Android release signing**: Keystore passwords passed as environment variables (`GRADLE_KEYSTORE`, `GRADLE_KEYSTORE_PASSWORD`, etc.), set by Fastlane from `.env` files.

**iOS code signing**: Managed by Fastlane Match from private git repo. Match password in Fastlane env files.

> Note: The root CLAUDE.md mentions `.env.*` files are encrypted with `git secret`, but the mobile package's `.env.*.yml` files and fastlane `.env` files appear to be committed in cleartext.

---

## Testing & Tooling

### Jest Configuration

- **Preset**: `react-native`
- **Setup files**: `jest.setup.ts`, `jest-mapbox.setup.ts`, `react-native-gesture-handler/jestSetup.js`
- **Path alias**: `~` → `src/`
- **Transform handling**: Dynamically scans both local and root `node_modules/` to include react-native and react-navigation packages in transforms; excludes `@apollo/client`
- **Reporters**: default + jest-summary-reporter

### Mock Infrastructure (`__mocks__/`)

17 mock files covering:

- **Native modules**: react-native-fs, react-native-iap (with custom Emitter class), react-native-image-picker, react-native-fast-image, react-native-code-push
- **Firebase**: messaging (MockMessaging class with token management), analytics
- **Mapbox**: Full MGLModule/MGLOfflineModule/MGLLocationModule mock with all constants and methods in `jest-mapbox.setup.ts`
- **Config/i18n**: react-native-config, react-native-localize, react-i18next
- **Community modules**: netinfo, async-storage, masked-view
- **Icons**: MaterialCommunityIcons, MaterialIcons
- **Social**: Facebook SDK

### Test Patterns (~25 test files)

| Pattern             | Libraries                                                | Example                                                  |
| ------------------- | -------------------------------------------------------- | -------------------------------------------------------- |
| Component rendering | `@testing-library/react-native`                          | `TextWithLinks.test.tsx`, `DownloadButton.test.tsx`      |
| Hook testing        | `@testing-library/react-hooks`                           | `useDownloadMap.test.ts`, `useLastNotNull.test.ts`       |
| Apollo/GraphQL      | `mockApolloProvider` from clients, `@graphql-tools/mock` | `OfflineContentProvider.test.tsx`, `useSkus.test.tsx`    |
| Apollo link chain   | `fetch-mock`, `execute(link, { query })`                 | `link.test.ts` (JWT refresh, retry, concurrent requests) |
| Auth flows          | Fake timers, `flushPromises()`, event listeners          | `service.test.ts`                                        |
| IAP integration     | Provider wrapper, consumer pattern                       | `IAPProvider.test.tsx`                                   |

### Other Tooling

- **Sentry**: Error tracking via `@sentry/react-native`. App wrapped in `Sentry.wrap()`. Custom `trackError()` function.
- **Flipper**: Debug-only (Debug build on iOS, debug variant on Android). Plugins: Inspector, Databases, SharedPreferences, CrashReporter, Network, Fresco.
- **TypeScript**: Strict mode, extends root `tsconfig.json`, `jsx: "react-native"`.
- **Custom Babel plugin** (`scripts/babel/index.js`): Replaces `PJSON_VERSION` identifier with actual package.json version string at compile time.

---

## Internationalization (i18n)

### Setup

Uses `i18next` + `react-i18next`. Initialized in `src/i18n/I18nProvider.tsx`.

**Language detection priority**:

1. User profile preference (`me?.language` from backend)
2. Device locale (`react-native-localize.getLocales()[0].languageCode`)
3. Fallback: English (`en`)
4. E2E mode: Forces `cimode` (shows translation keys)

**On language change** (login or profile update):

- Switches i18next language
- Purges Apollo cache (server data is language-dependent)
- Updates date-fns locale

### Translation Resources

- `src/i18n/resources.ts` — aggregated translations
- `src/i18n/remap.json` — key-to-namespace mapping
- `src/i18n/extra.json` — additional strings
- `@whitewater-guide/translations` — shared translation package (npm)
- Organized by namespace (screens, common, validation, etc.)

### Custom Formatters (`src/i18n/formatters/`)

| Formatter     | Purpose                     |
| ------------- | --------------------------- |
| `brackets.ts` | Format text within brackets |
| `byteSize.ts` | Bytes → KB/MB/GB            |
| `month.ts`    | Localized month names       |

### Supported Languages

Defined in `src/i18n/languages.ts` as `SUPPORTED_LANGUAGES` array. Native localization files exist for English and Russian (`en.lproj/`, `ru.lproj/`).

---

## App Structure

### Directory Layout (`src/`)

```
src/
├── App.tsx              # Entry point (class component, Sentry-wrapped)
├── assets/              # Static images, icons, fonts
├── components/          # Reusable UI: chart, header, map, multi-slider,
│                        #   photo-gallery, photo-picker, swipeable, ~30 more
├── core/                # Infrastructure
│   ├── apollo/          #   Apollo client, link chain, cache (MMKV)
│   ├── auth/            #   MobileAuthService, token management, social login
│   ├── config/          #   App initialization, polyfills, migrations
│   ├── errors/          #   Sentry setup, error tracking
│   └── navigation/      #   React Navigation setup, screen names enum,
│                        #     deep linking, persistence, drawer
├── declarations/        # TypeScript .d.ts for untyped modules
├── features/            # Feature modules
│   ├── banners/         #   Banner notifications
│   ├── chat/            #   Matrix chat state provider
│   ├── descents/        #   Descent formatting utilities
│   ├── media/           #   Media utilities and components
│   ├── offline/         #   Offline content (map/photo/section downloading,
│   │                    #     caching, progress tracking, MMKV + filesystem)
│   ├── purchases/       #   IapProvider, subscription management
│   ├── sections/        #   Section-specific utilities
│   ├── settings/        #   AppSettingsProvider (map type, UI tips, AsyncStorage)
│   ├── tags/            #   Tag cache management
│   └── uploads/         #   File upload tracking
├── forms/               # Formik field components: TextField, PasswordField,
│                        #   NumericField, CheckboxField, RatingField, TagsField,
│                        #   ModalPickerField, PhotoUploadField, useValidate
├── i18n/                # I18nProvider, language detection, formatters, resources
├── screens/             # Screen components by feature
│   ├── auth/            #   Sign in, register, forgot password, social, welcome
│   ├── add-section/     #   Multi-tab form for user-submitted sections
│   ├── descent-form/    #   Multi-screen form with nav param hydration
│   ├── descent/         #   Descent detail view
│   ├── logbook/         #   User's descent history
│   ├── my-profile/      #   Profile management
│   ├── region/          #   Tabbed: map, sections list, info
│   ├── regions-list/    #   Main discovery screen
│   ├── section/         #   Tabbed: map, chart, info, media
│   ├── purchase/        #   Subscription purchase flow
│   ├── chat/            #   Chat screen
│   ├── suggestion/      #   Feedback/suggestion
│   ├── license/         #   Legal/license info
│   ├── webview/         #   Generic web view
│   └── plain/           #   Generic content screens
├── test/                # Test utilities and helpers
├── theme/               # Colors, spacing, dimensions, shadows, Paper theme
└── utils/               # URL helpers, date validation, hooks (usePrevious,
                         #   useLastNotNull, useFocus)
```

### Provider Stack (App.tsx)

The app is a class component that initializes Apollo client asynchronously, then renders a deep provider tree:

```
GestureHandlerRootView
└─ PaperProvider (theme)
   └─ ApolloProvider (GraphQL)
      └─ TagsProvider
         └─ AuthProvider
            └─ I18nProvider
               └─ ChatClientStateProvider
                  └─ UploadsProvider
                     └─ RegionsFilterProvider
                        └─ AppSettingsProvider
                           └─ IapProvider
                              └─ OfflineContentProvider
                                 └─ ActionSheetProvider
                                    └─ NavigationRoot
```

### Navigation

- **React Navigation 6** with stack, drawer, material-top-tabs, and material-bottom-tabs
- **71+ screen names** defined in `core/navigation/screen-names.ts` enum
- **Type-safe params** via `RootStackParamsList`
- **Lazy loading**: Screens use `react-native-bundle-splitter` for code splitting
- **Nested navigators**: AuthStack, PurchaseStack, RegionStack, DescentFormStack
- **Deep linking**: `useLinking()` hook processes URLs
- **State persistence**: `usePersistence()` hook restores navigation state

---

## Core JS Libraries

### Forms & Validation

- **Formik** for form state management
- **Yup** schemas from `@whitewater-guide/validation` package
- Custom `useValidate()` hook wraps Yup → Formik validator via `createSafeValidator()`
- `useReactNativeHandlers()` bridges Formik events to RN TextInput format
- Field components in `src/forms/`: TextField, PasswordField (with strength indicator), NumericField, CheckboxField, RatingField, TagsField, ModalPickerField, PhotoUploadField
- **Multi-screen form pattern** (descent form): Formik mounted at top level, state synced to navigation params via `useNavHydrateFormik()` for survival across screen transitions

### Server Interactions (Apollo GraphQL)

**Client setup** (`core/apollo/`):

- Link chain: `accessTokenLink` → `errorLink` → `removeTypenameFromVariables` → `TokenRefreshLink` → `retryLink` → `httpLink`
- Cache: MMKV-backed persistent cache with schema versioning (v3). Purges on version mismatch, cleared on sign-in.
- Error policy: `all` (returns partial data with errors)

**Query/mutation pattern**:

- `.gql` files alongside screen components
- Generated `.generated.ts` siblings with typed hooks (near-operation-file preset from codegen)
- Mobile-specific local schema extends `Region` type with `offlineDate` field

### Authentication (`core/auth/`)

- `MobileAuthService` extends `BaseAuthService` from `@whitewater-guide/clients`
- JWT stored in AsyncStorage, auto-refreshed on app resume via AppState listener
- Social auth: Facebook (`react-native-fbsdk-next`), Apple (`@invertase/react-native-apple-authentication`), Google (via Firebase)
- FCM token sent to backend after sign-in, refreshed on change

### State Management

Multi-layered approach (no Redux/MobX):

1. **Server state**: Apollo Client cache (MMKV-persisted)
2. **Auth state**: Custom auth service + context provider
3. **Navigation/form state**: React Navigation params + Formik
4. **Feature contexts**: AppSettings (AsyncStorage), Chat, Uploads, IAP, Offline, RegionsFilter, Tags — all via React Context
5. **Local state**: `useState`/`useRef` in components

---

## UI Framework & Styling

### React Native Paper (Material Design 2)

- Extends `MD2LightTheme` with custom colors
- Used for: TextInput, Button, Surface, Appbar, BottomNavigation
- Components auto-consume theme via PaperProvider context

### Theme (`src/theme/`)

```
Colors:
  primary: #2196f3 (Material Blue 500)
  accent:  #FF9900 (Orange)
  logoBlue: #0078b4
  error:   #f44336
  enabled: #4CAF50

Spacing: 4 / 8 / 16 / 24 px
Rounding: 4 / 8 px
```

### Styling Approach

- **`StyleSheet.create()`** for all static styles (compiled to native)
- Theme object imported directly (no CSS-in-JS, no styled-components)
- Safe area via `react-native-safe-area-context`
- Layout components: `Screen`, `Row`, `KeyboardAvoidingView`, `Paper`, `Divider`, `Spacer`
- Icons: Material Design Icons via `react-native-vector-icons` (24px regular, 32px large)
- Gestures: `react-native-gesture-handler`
- Bottom sheets: `@gorhom/bottom-sheet`
