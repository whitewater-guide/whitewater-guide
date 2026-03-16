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

## 3.3 — Install UI framework deps

```bash
pnpm add react-native-paper react-native-linear-gradient
```

`react-native-svg@^15.15.3` and `@react-native-vector-icons/material-design-icons@^12.4.2` are **already installed and working** ✅.

Note: the project uses `@react-native-vector-icons/material-design-icons` (the new scoped package) instead of the old `react-native-vector-icons`. No separate font setup needed — the new package auto-links.

Target versions:

- `react-native-paper` v5.15

### Paper theme

Configure a minimal Paper `MD3LightTheme` with default colors. The full theme port happens in Phase 4 (Navigation) alongside the header and drawer.

### Notes

Paper covers these old deps (no separate install needed):

- `react-native-snackbar` → use `Paper.Snackbar`
- `react-native-modal-popover` → use `Paper.Menu`

### Smoke test

- Storybook story: render a `Paper.Button`, a `Paper.Card`, and a vector icon

### Verify

- [ ] iOS builds with UI deps
- [ ] Android builds with UI deps
- [ ] Paper Button renders in Storybook
- [ ] Vector icon renders in Storybook

---

## 3.4 — Install layout & list deps

`@gorhom/bottom-sheet@^5.2.8` is **already installed and working** ✅.

```bash
pnpm add @shopify/flash-list \
  @expo/react-native-action-sheet
```

### @expo/react-native-action-sheet

This is a pure JS package (no native linking), so it should just work. It may pull in `expo` as a peer dep — if so, this aligns with the expo-image decision from Phase 0.

### Smoke test

- Storybook story: `FlashList` with 20 sample items
- Storybook story: `BottomSheet` with a handle and content

### Verify

- [ ] iOS builds with layout deps
- [ ] Android builds with layout deps
- [ ] FlashList renders and scrolls in Storybook
- [ ] BottomSheet opens/closes in Storybook

---

## 3.5 — Install maps

```bash
pnpm add @rnmapbox/maps@10.3.0-rc.0
```

**This is the highest-risk dependency.** It has native SDKs for both platforms with non-trivial build configuration.

### Android setup

1. Add Mapbox Maven repository to `android/build.gradle`:
   ```gradle
   allprojects {
       repositories {
           maven {
               url 'https://api.mapbox.com/downloads/v2/releases/maven'
               authentication { basic(BasicAuthentication) }
               credentials {
                   username = "mapbox"
                   password = project.properties['MAPBOX_DOWNLOADS_TOKEN'] ?: ""
               }
           }
       }
   }
   ```
2. Add download token to `android/local.properties` (gitignored)

### iOS setup

1. Add Mapbox pod source in `ios/Podfile`
2. Configure `~/.netrc` with Mapbox download credentials
3. `cd ios && pod install`

### Smoke test

- Render a basic `MapView` — this may only work on a device/emulator, not in Storybook on its own
- Verify Mapbox access token loads from `react-native-config`

### Verify

- [ ] iOS builds with Mapbox
- [ ] Android builds with Mapbox
- [ ] Map tiles load on iOS simulator
- [ ] Map tiles load on Android emulator
- [ ] No Mapbox token errors in Metro logs

---

## 3.6 — Install storage & data deps

`@react-native-async-storage/async-storage@^3.0.1` is **already installed and working** ✅.

```bash
pnpm add react-native-mmkv react-native-sensitive-info \
  @react-native-clipboard/clipboard
```

Target versions:

- `react-native-mmkv` v4 (JSI-based, replaces `react-native-mmkv-storage`)

### Storybook stories

Create an interactive story for each storage/data dependency. Each story should use Paper components and contain:

- A `TextInput` for entering a value
- A `Button` that writes the value to storage
- A `Button` that reads the value from storage
- A `Text` that displays the read value

Stories to create:

1. **MMKV.stories.tsx** — write/read a key-value pair using `react-native-mmkv`
2. **AsyncStorage.stories.tsx** — write/read using `@react-native-async-storage/async-storage`
3. **SensitiveInfo.stories.tsx** — write/read using `react-native-sensitive-info` (secure storage)
4. **Clipboard.stories.tsx** — copy text to clipboard and read it back using `@react-native-clipboard/clipboard`

### Verify

- [ ] iOS builds with storage deps
- [ ] Android builds with storage deps
- [ ] MMKV write/read works in Storybook
- [ ] AsyncStorage write/read works in Storybook
- [ ] SensitiveInfo write/read works in Storybook
- [ ] Clipboard copy/paste works in Storybook

---

## 3.7 — Install media & content deps

```bash
pnpm add react-native-image-picker \
  react-native-webview @ronradtke/react-native-markdown-display
```

Target versions:

- `react-native-image-picker` v8
- `react-native-webview` v13
- `@ronradtke/react-native-markdown-display` v8 (fork of `react-native-markdown-renderer`, actively maintained)

### Image gallery (react-native-awesome-gallery) — SKIPPED

`react-native-awesome-gallery` requires `react-native-reanimated ^3.2.0` and is incompatible with reanimated v4. No suitable alternative found. The image gallery/zoom viewer will be reimplemented from scratch using `react-native-gesture-handler` + `react-native-reanimated` v4 directly (deferred to feature phase).

### Smoke test

- Storybook story: render `Markdown` with sample content (headings, bold, links, code blocks)
- Storybook story: render a `WebView` loading a simple URL

### Verify

- [ ] iOS builds with media deps
- [ ] Android builds with media deps
- [ ] Markdown renders in Storybook
- [ ] WebView loads a page in Storybook

---

## 3.8 — Install platform utility deps

```bash
pnpm add react-native-device-info react-native-localize \
  @react-native-community/netinfo @react-native-community/datetimepicker \
  react-native-keyboard-controller
```

Target versions:

- `react-native-device-info` v15
- `@react-native-community/netinfo` v12
- `@react-native-community/datetimepicker` v8
- `react-native-keyboard-controller` v1 (replaces `react-native-avoid-softinput`)

### Storybook stories

Create a story for each dependency to verify it works:

1. **DeviceInfo.stories.tsx** — display device info (brand, model, OS version, app version, unique ID)
2. **Localize.stories.tsx** — display detected locale, country, currency, temperature unit, calendar
3. **NetInfo.stories.tsx** — display current connection type, whether connected, whether internet reachable; update on change
4. **DateTimePicker.stories.tsx** — render a date picker and a time picker, display selected value
5. **KeyboardController.stories.tsx** — render a `TextInput` inside `KeyboardAvoidingView` from `react-native-keyboard-controller`, verify keyboard avoidance works

### Verify

- [ ] iOS builds with platform utility deps
- [ ] Android builds with platform utility deps
- [ ] DeviceInfo story displays device data
- [ ] NetInfo story shows connection status
- [ ] DateTimePicker story allows date selection
- [ ] KeyboardController story avoids keyboard

---

## 3.9 — Verify workspace package imports ✅ DONE

Workspace packages are verified and working. Metro resolves them correctly via `watchFolders` and `nodeModulesPaths` in `metro.config.js`. Tested on the app screen.

Verified packages:

- `@whitewater-guide/clients` (workspace:\*)
- `@whitewater-guide/commons` (workspace:\*)
- `@whitewater-guide/schema` (workspace:\*)
- `@whitewater-guide/validation` (workspace:\*)
- `@whitewater-guide/translations` (^2.6.8)

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

## 3.11 — Set up i18n

### Install dependencies

```bash
pnpm add i18next react-i18next date-fns date-fns-tz
```

- `react-native-localize` is already installed (3.8)
- `@whitewater-guide/translations` is a workspace package (already verified in 3.9)
- `date-fns` v2.x and `date-fns-tz` v2.x (stay on v2 — shared packages require it)

### Port I18nProvider

Port from `packages/mobile/src/i18n/`:

1. **Language detection:** user profile language → `react-native-localize` device locale → fallback `'en'`
2. **i18next configuration:**
   ```typescript
   i18n.use(initReactI18next).init({
     compatibilityJSON: 'v4',
     fallbackLng: 'en',
     interpolation: { escapeValue: false },
     resources: aggregatedResources,
   });
   ```
3. **Translation resources:** Aggregate from `@whitewater-guide/translations` package
4. **Custom formatters:** Port bracket formatter, byteSize formatter, month formatter from old app
5. **Language switch handler:** When language changes, update i18next locale and (later in Phase 7) trigger Apollo cache purge

### Storybook smoke story

```tsx
// I18n.stories.tsx
export const LanguageSwitch = () => {
  const { t, i18n } = useTranslation();
  return (
    <View>
      <Text>{t('commons:ok')}</Text>
      <Button onPress={() => i18n.changeLanguage('ru')} title="Switch to RU" />
      <Button onPress={() => i18n.changeLanguage('en')} title="Switch to EN" />
    </View>
  );
};
```

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
