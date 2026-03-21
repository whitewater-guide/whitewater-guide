# Phase 3: Dependency Integration & Build Validation

**Goal:** Install all major native dependencies one by one, verifying the app builds and launches after each. Catch build/linking issues early before adding feature code. Set up Storybook for smoke-testing components. End with i18n as foundational infrastructure.

**Strategy:** After each dependency group, run `pnpm react-native build-ios` and `pnpm react-native build-android`. If a build breaks, fix it before moving on. This front-loads build issues that would otherwise block feature work.

---

## 3.1 — Storybook setup ✅ DONE

Storybook for React Native v10.2.3 is installed and working (on-device).

Installed packages:

- `@storybook/react-native@^10.2.3` (devDependency)
- `storybook@^10.2.19` (devDependency)

Setup completed:

- `.storybook/` entry point and config
- `storybook:generate`, `storybook:start`, `storybook:ios`, `storybook:android` scripts in `package.json`
- Conditional rendering of Storybook vs App based on `STORYBOOK_ENABLED` env var
- `babel-plugin-transform-inline-environment-variables` for env var access

---

## 3.2 — Install navigation & animation stack ✅ DONE

All navigation and animation dependencies are installed and working.

Installed packages:

- `react-native-gesture-handler@^2.30.0` ✅
- `react-native-reanimated@^4.2.2` ✅
- `react-native-safe-area-context@^5.5.2` ✅
- `react-native-worklets@^0.7.4` ✅ (required by reanimated v4)
- `@react-navigation/native@^7.1.33` ✅
- `@react-navigation/native-stack@^7.14.5` ✅
- `@react-navigation/drawer@^7.9.4` ✅
- `@react-navigation/bottom-tabs@^7.15.5` ✅
- `@react-navigation/material-top-tabs@^7.4.19` ✅
- `react-native-screens@^4.24.0` ✅
- `@react-native-masked-view/masked-view@^0.3.2` ✅
- `react-native-pager-view@^8.0.0` ✅
- `react-native-tab-view@^4.3.0` ✅

Reanimated Babel plugin is configured. Gesture handler import is in the entry point.

Minimal two-screen navigation demo (Home → Details with push/pop) is implemented in `src/App.tsx`.

### Verified

- [x] iOS builds and launches with navigation deps
- [x] Android builds and launches with navigation deps
- [x] Minimal two-screen nav works (push/pop)

---

## 3.3 — Install UI framework deps ✅ DONE

Installed packages:

- `react-native-paper@^5.15.0` ✅
- `react-native-linear-gradient@^2.8.3` ✅
- `react-native-svg@^15.15.3` (already installed) ✅
- `@react-native-vector-icons/material-design-icons@^12.4.2` (already installed) ✅

Note: the project uses `@react-native-vector-icons/material-design-icons` (the new scoped package) instead of the old `react-native-vector-icons`. No separate font setup needed — the new package auto-links.

### Paper theme

`PaperProvider` with default `MD3LightTheme` is configured in `src/App.tsx` and as a Storybook decorator in `.rnstorybook/preview.tsx`. The full theme port happens in Phase 4 (Navigation) alongside the header and drawer.

### Notes

Paper covers these old deps (no separate install needed):

- `react-native-snackbar` → use `Paper.Snackbar`
- `react-native-modal-popover` → use `Paper.Menu`

### Smoke test

- Storybook story (`PaperUI.stories.tsx`): renders a `Paper.Card`, `Paper.Button`, and vector icons

### Verified

- [x] iOS builds with UI deps
- [x] Android builds with UI deps
- [x] Paper Button renders in Storybook
- [x] Vector icon renders in Storybook

---

## 3.4 — Install layout & list deps ✅ DONE

Installed packages:

- `@shopify/flash-list@^2.3.0` ✅
- `@expo/react-native-action-sheet@^4.1.1` ✅ (pure JS, no native linking)
- `@gorhom/bottom-sheet@^5.2.8` (already installed) ✅

### Smoke test

- Storybook story: `FlashList.stories.tsx` — FlashList with 20 sample items
- Storybook story: `BottomSheet.stories.tsx` — BottomSheet with open/close and snap points

### Verify

- [ ] iOS builds with layout deps
- [ ] Android builds with layout deps
- [ ] FlashList renders and scrolls in Storybook
- [ ] BottomSheet opens/closes in Storybook

---

## 3.5 — Install storage & data deps ✅ DONE

Installed packages:

- `react-native-mmkv@^4.2.0` ✅ (JSI-based via NitroModules, replaces `react-native-mmkv-storage`)
- `react-native-nitro-modules@^0.35.2` ✅ (required peer dep for MMKV v4)
- `react-native-sensitive-info@^5.6.2` ✅
- `@react-native-clipboard/clipboard@^1.16.3` ✅
- `@react-native-async-storage/async-storage@^3.0.1` (already installed) ✅

### Storybook stories

Interactive write/read stories using Paper components:

1. **MMKV.stories.tsx** — write/read using `createMMKV()` (v4 API)
2. **AsyncStorage.stories.tsx** — write/read using AsyncStorage
3. **SensitiveInfo.stories.tsx** — write/read using Keychain (iOS) / SharedPreferences (Android)
4. **Clipboard.stories.tsx** — copy/paste using Clipboard

### Verify

- [ ] iOS builds with storage deps
- [ ] Android builds with storage deps
- [ ] MMKV write/read works in Storybook
- [ ] AsyncStorage write/read works in Storybook
- [ ] SensitiveInfo write/read works in Storybook
- [ ] Clipboard copy/paste works in Storybook

---

## 3.6 — Install media & content deps ✅ DONE

Installed packages:

- `react-native-image-picker@^8.2.1` ✅
- `react-native-webview@^13.16.1` ✅
- `@ronradtke/react-native-markdown-display@^8.1.0` ✅

### Image gallery (react-native-awesome-gallery) — SKIPPED

`react-native-awesome-gallery` requires `react-native-reanimated ^3.2.0` and is incompatible with reanimated v4. No suitable alternative found. The image gallery/zoom viewer will be reimplemented from scratch using `react-native-gesture-handler` + `react-native-reanimated` v4 directly (deferred to feature phase).

### Smoke test

- Storybook story: `Markdown.stories.tsx` — renders headings, bold, italic, lists, links, code blocks
- Storybook story: `WebView.stories.tsx` — loads reactnative.dev

### Verify

- [ ] iOS builds with media deps
- [ ] Android builds with media deps
- [ ] Markdown renders in Storybook
- [ ] WebView loads a page in Storybook

---

## 3.7 — Install platform utility deps ✅ DONE

Installed packages:

- `react-native-device-info@^15.0.2` ✅
- `react-native-localize@^3.7.0` ✅
- `@react-native-community/netinfo@^12.0.1` ✅
- `@react-native-community/datetimepicker@^9.0.0` ✅
- `react-native-keyboard-controller@^1.21.0` ✅ (replaces `react-native-avoid-softinput`)

### Storybook stories

1. **DeviceInfo.stories.tsx** — displays brand, model, OS version, app version, unique ID using Paper DataTable
2. **Localize.stories.tsx** — displays locale, country, currency, temperature unit, calendar, timezone, 24h clock
3. **NetInfo.stories.tsx** — live connection type, connected status, internet reachable; fetch button for manual check
4. **DateTimePicker.stories.tsx** — date picker and time picker with selected value display
5. **KeyboardController.stories.tsx** — multiple TextInputs inside KeyboardAvoidingView from keyboard-controller

### Verify

- [ ] iOS builds with platform utility deps
- [ ] Android builds with platform utility deps
- [ ] DeviceInfo story displays device data
- [ ] NetInfo story shows connection status
- [ ] DateTimePicker story allows date selection
- [ ] KeyboardController story avoids keyboard

---

## 3.8 — Verify workspace package imports ✅ DONE

Workspace packages are verified and working. Metro resolves them correctly via `watchFolders` and `nodeModulesPaths` in `metro.config.js`. Tested on the app screen.

Verified packages:

- `@whitewater-guide/clients` (workspace:\*)
- `@whitewater-guide/commons` (workspace:\*)
- `@whitewater-guide/schema` (workspace:\*)
- `@whitewater-guide/validation` (workspace:\*)
- `@whitewater-guide/translations` (^2.6.8)

---

## 3.9 — Install maps ✅ DONE

Installed packages:

- `@rnmapbox/maps@^10.3.0-rc.0` ✅

**This is the highest-risk dependency.** It has native SDKs for both platforms with non-trivial build configuration.

### Android setup

1. Added Mapbox Maven repository to `android/build.gradle` with basic authentication
2. Added `RNMapboxMapsImpl=mapbox` to `android/gradle.properties`
3. Added `MAPBOX_DOWNLOADS_TOKEN` to `android/local.properties` (gitignored)

### iOS setup

1. Added `$RNMapboxMapsImpl = 'mapbox'` to `ios/Podfile`
2. Added `pre_install` and `post_install` hooks for `$RNMapboxMaps`
3. `~/.netrc` already configured with Mapbox download credentials
4. `pod install` succeeded — installed MapboxMaps 11.18.2, MapboxCommon 24.18.2, MapboxCoreMaps 11.18.2, Turf 4.0.0

### Smoke test

- Storybook story: `MapView.stories.tsx` — renders Mapbox MapView with Camera centered on New York

### Verify

- [x] iOS builds with Mapbox
- [x] Android builds with Mapbox
- [ ] Map tiles load on iOS simulator
- [ ] Map tiles load on Android emulator
- [ ] No Mapbox token errors in Metro logs

---

## 3.10 — Set up smoke tests & integration tests

### Jest configuration

Jest should already be configured from Phase 1. Add:

```typescript
// __tests__/smoke.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

it('renders without crashing', () => {
  expect(() => render(<App />)).not.toThrow();
});
```

### Build verification script

Create a script that builds both platforms in CI-friendly mode (no device/emulator needed):

```bash
# scripts/verify-builds.sh
#!/bin/bash
set -e

echo "Building iOS..."
cd ios && xcodebuild -workspace mobile2.xcworkspace \
  -scheme mobile2 -configuration Debug \
  -sdk iphonesimulator -arch x86_64 \
  build CODE_SIGNING_ALLOWED=NO | tail -n 5

echo "Building Android..."
cd ../android && ./gradlew assembleDebug --no-daemon | tail -n 5

echo "Both platforms build successfully!"
```

### Verify

- [ ] `pnpm test` passes with smoke test
- [ ] Build verification script succeeds for both platforms

---

## 3.11 — Set up i18n ✅ DONE

Installed packages:

- `i18next@^23.16.8` ✅
- `react-i18next@^13.5.0` ✅
- `date-fns@^2.30.0` ✅
- `date-fns-tz@^2.0.1` ✅
- `pretty-bytes@^7.1.0` ✅ (for byteSize formatter)
- `react-native-localize@^3.7.0` (already installed in 3.7) ✅
- `@whitewater-guide/translations@^2.6.8` (already installed in 3.8) ✅

### Implementation

Ported from `apps/mobile/src/i18n/`:

1. **`src/i18n/I18nProvider.tsx`** — i18next initialization with `compatibilityJSON: 'v4'`, device locale detection via `react-native-localize`, `configDateFNS` integration
2. **`src/i18n/resources.ts`** — Translation resources aggregated from `@whitewater-guide/translations/mobile/{de,en,es,fr,ru}`
3. **`src/i18n/languages.ts`** — `SUPPORTED_LANGUAGES` and `LANGUAGE_NAMES` constants
4. **`src/i18n/formatters/`** — Custom i18next formatters: `brackets`, `byteSize`, `month`
5. **`src/i18n/getSeasonLocalizer.ts`** — Season/month localization helper
6. **`src/i18n/index.ts`** — Barrel exports

### Integration

- `I18nProvider` wraps app content in `src/App.tsx`
- `I18nProvider` added as Storybook decorator in `.rnstorybook/preview.tsx`
- Storybook story: `I18n.stories.tsx` — language switch with translation key display

### Notes

- Auth-driven language switching (user profile → language) is deferred to Phase 7 when auth is ported. Currently detects device locale only.
- Dropped `compatibilityJSON: 'v3'` in favor of `'v4'` (i18next v23 default)
- Dropped dev-mode `remapResources` / `extra.json` / `deepmerge` — not needed in new app
- Replaced `lodash/toNumber` with `Number()` in byteSize formatter
- Replaced `lodash/memoize` with simple closure cache in getSeasonLocalizer

### Verify

- [ ] i18n initializes with detected device language
- [ ] Translation strings display correctly in English
- [ ] Language switch to Russian works (strings update)
- [ ] Language switch back to English works
- [ ] Date formatters work (`date-fns` locale integration)
- [ ] Custom formatters (brackets, byteSize, month) produce correct output

---

## 3.12 — Deps not installed (handled by replacements or dropped)

The following old deps do **not** need new packages — tracked here for completeness:

| Old dep                          | Resolution                                                                              |
| -------------------------------- | --------------------------------------------------------------------------------------- |
| `react-native-bundle-splitter`   | Use `React.lazy` + `Suspense` (built into React 18+)                                    |
| `react-native-text-size`         | Use `Text.onTextLayout` callback                                                        |
| `react-native-modal-popover`     | Use Paper `Menu` component (installed in 3.3)                                           |
| `react-native-snackbar`          | Use Paper `Snackbar` component (installed in 3.3)                                       |
| `react-native-avoid-softinput`   | Replaced by `react-native-keyboard-controller` (installed in 3.8)                       |
| `react-native-big-list`          | Replaced by `@shopify/flash-list` (installed in 3.4)                                    |
| `react-native-image-zoom-viewer` | Custom implementation using gesture-handler + reanimated v4 (deferred to feature phase) |
| `react-native-mmkv-storage`      | Replaced by `react-native-mmkv` (installed in 3.6)                                      |
| `react-native-iphone-x-helper`   | Use `useSafeAreaInsets()` from `react-native-safe-area-context` (installed in 3.2)      |
| `react-native-redash`            | Inline utilities or use `react-native-reanimated` v4 built-ins (installed in 3.2)       |

---

## 3.13 — Final validation

- [ ] App builds and launches on iOS after **all** deps installed
- [ ] App builds and launches on Android after **all** deps installed
- [ ] Storybook launches and all smoke stories render on iOS
- [ ] Storybook launches and all smoke stories render on Android
- [ ] Workspace packages (`clients`, `schema`, `commons`, `validation`) import correctly ✅
- [ ] TypeScript types resolve for all workspace packages ✅
- [ ] Jest smoke test passes
- [ ] i18n: language detection works on app launch
- [ ] i18n: strings display correctly in English and Russian
- [ ] i18n: language switch works bidirectionally (EN ↔ RU)
- [ ] No TypeScript errors (`pnpm typecheck`)
- [ ] No ESLint errors (`pnpm lint`)
- [ ] Build verification script passes for both platforms

---

## Troubleshooting guide

### Common build failures

| Symptom                          | Likely cause                         | Fix                                                                    |
| -------------------------------- | ------------------------------------ | ---------------------------------------------------------------------- |
| `Undefined symbols` on iOS       | Missing pod install after adding dep | `cd ios && pod install`                                                |
| `Could not find` on Android      | Missing Maven repo or wrong version  | Check `build.gradle` repositories                                      |
| Reanimated crash on launch       | Missing Babel plugin                 | Add `'react-native-reanimated/plugin'` as last Babel plugin            |
| Metro `Unable to resolve module` | Symlink not followed                 | Check `metro.config.js` `watchFolders`                                 |
| `Duplicate module` errors        | pnpm hoisting issue                  | Check `.npmrc` for `shamefully-hoist=true`, or add `nohoist`           |
| New Arch crash                   | Dep not New Arch compatible          | Check dep's GitHub issues; test with `newArchEnabled=false` to isolate |

### If a dep breaks the build

1. Revert the dep addition
2. Check the dep's GitHub issues for RN 0.84 / New Arch compatibility
3. If incompatible, check for a fork or alternative
4. If no alternative, install but disable New Architecture for that module (if possible)
5. Document the workaround in this file
