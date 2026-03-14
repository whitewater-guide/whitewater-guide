# Phase 3: Dependency Integration & Build Validation

**Goal:** Install all major native dependencies one by one, verifying the app builds and launches after each. Catch build/linking issues early before adding feature code. Set up Storybook for smoke-testing components. End with i18n as foundational infrastructure.

**Strategy:** After each dependency group, run `pnpm ios` and `pnpm android` (or equivalent build commands). If a build breaks, fix it before moving on. This front-loads build issues that would otherwise block feature work.

---

## 3.1 — Storybook setup

Install Storybook for React Native v10.2.3. This version runs inside the app (on-device).

```bash
pnpm add -D @storybook/react-native@10.2.3 \
  @storybook/addon-ondevice-controls \
  @storybook/addon-ondevice-actions \
  @storybook/react-native-theming
```

Setup:

1. Create `.storybook/index.ts` as the Storybook entry point
2. Create `.storybook/main.ts` with stories glob pattern: `../src/**/*.stories.tsx`
3. Add `storybook` script to `package.json` that sets `STORYBOOK_ENABLED=true` env var
4. In the app entry point, conditionally render `StorybookUIRoot` or the real `App` based on env var
5. Stories live next to components as `ComponentName.stories.tsx`
6. Create a simple `HelloWorld.stories.tsx` to verify setup

### Verify

- [ ] `pnpm storybook` launches app in Storybook mode
- [ ] HelloWorld story renders on both platforms

## 3.2 — Install navigation & animation stack

Install and verify build after each group:

```bash
# Core navigation
pnpm add @react-navigation/native @react-navigation/native-stack \
  @react-navigation/drawer @react-navigation/bottom-tabs \
  @react-navigation/material-top-tabs

# Required native deps
pnpm add react-native-screens react-native-gesture-handler \
  react-native-reanimated react-native-safe-area-context \
  @react-native-masked-view/masked-view
```

All `@react-navigation/*` packages should be v7. Check that:

- `react-native-screens` is v4
- `react-native-gesture-handler` is latest v2
- `react-native-reanimated` is v4
- `react-native-safe-area-context` is v5

### Reanimated Babel plugin

Add to `babel.config.js`:

```js
plugins: ['react-native-reanimated/plugin'];
```

This must be the **last** plugin in the list.

### Gesture handler setup

Add to the app entry point (before any navigation code):

```typescript
import 'react-native-gesture-handler';
```

### Smoke test

- Create a minimal two-screen stack navigator to verify navigation works
- Storybook story: wrap a component in `NavigationContainer` to verify no crashes

### Verify

- [ ] iOS builds and launches with navigation deps
- [ ] Android builds and launches with navigation deps
- [ ] Minimal two-screen nav works (push/pop)

## 3.3 — Install UI framework deps

```bash
pnpm add react-native-paper react-native-vector-icons \
  react-native-svg react-native-linear-gradient
```

Target versions:

- `react-native-paper` v5.15
- `react-native-svg` v15

### react-native-vector-icons setup

- iOS: Add fonts to Xcode project (or use `react-native.config.js` auto-linking)
- Android: Add to `android/app/build.gradle`:
  ```gradle
  apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")
  ```

### Paper theme

At this point, configure a minimal Paper `MD3LightTheme` with default colors. The full theme port happens in Phase 4 (Navigation) alongside the header and drawer.

### Notes

Paper covers these old deps (no separate install needed):

- `react-native-snackbar` → use `Paper.Snackbar`
- `react-native-modal-popover` → use `Paper.Menu`

### Smoke test

- Storybook story: render a `Paper.Button`, a `Paper.Card`, and an SVG icon (`react-native-svg` or vector icon)

### Verify

- [ ] iOS builds with UI deps
- [ ] Android builds with UI deps
- [ ] Paper Button renders in Storybook
- [ ] Vector icon renders in Storybook
- [ ] SVG renders in Storybook

## 3.4 — Install layout & list deps

```bash
pnpm add @gorhom/bottom-sheet @shopify/flash-list \
  react-native-pager-view react-native-tab-view \
  @expo/react-native-action-sheet
```

Target versions:

- `@gorhom/bottom-sheet` v5 (requires reanimated v4 + gesture-handler, already installed)
- `react-native-pager-view` v8
- `react-native-tab-view` v4

### @expo/react-native-action-sheet

This is a pure JS package (no native linking), so it should just work. It may pull in `expo` as a peer dep — if so, this aligns with the expo-image decision from Phase 0.

### Smoke test

- Storybook story: `FlashList` with 20 sample items
- Storybook story: `BottomSheet` with a handle and content
- Storybook story: `PagerView` with 3 pages

### Verify

- [ ] iOS builds with layout deps
- [ ] Android builds with layout deps
- [ ] FlashList renders and scrolls in Storybook
- [ ] BottomSheet opens/closes in Storybook

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

## 3.6 — Install storage & data deps

```bash
pnpm add react-native-mmkv @react-native-async-storage/async-storage \
  react-native-sensitive-info @react-native-clipboard/clipboard
```

Target versions:

- `react-native-mmkv` v4 (JSI-based, replaces `react-native-mmkv-storage`)
- `@react-native-async-storage/async-storage` v3

### Smoke test

- Storybook story (or simple test): write a value to MMKV, read it back, display it
- Verify AsyncStorage basic set/get

### Verify

- [ ] iOS builds with storage deps
- [ ] Android builds with storage deps
- [ ] MMKV write/read works

## 3.7 — Install media & content deps

```bash
pnpm add react-native-image-picker react-native-awesome-gallery \
  react-native-webview @ronradtke/react-native-markdown-display
```

Target versions:

- `react-native-image-picker` v8
- `react-native-webview` v13
- `react-native-awesome-gallery` replaces `react-native-image-zoom-viewer`

### Smoke test

- Storybook story: render `Markdown` with sample content (headings, bold, links, code blocks)
- Storybook story: render a `WebView` loading a simple URL

### Verify

- [ ] iOS builds with media deps
- [ ] Android builds with media deps
- [ ] Markdown renders in Storybook
- [ ] WebView loads a page in Storybook

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

### Verify

- [ ] iOS builds with platform utility deps
- [ ] Android builds with platform utility deps

## 3.9 — Verify workspace package imports

The monorepo has shared packages that mobile2 must consume. Verify Metro bundler resolves them correctly.

### Test each package

Create a temporary test file (or Storybook story) that imports from each:

```typescript
// Verify @whitewater-guide/clients
import { configureApolloCache } from '@whitewater-guide/clients';

// Verify @whitewater-guide/schema
import type { Section } from '@whitewater-guide/schema';

// Verify @whitewater-guide/commons
import { formatDate } from '@whitewater-guide/commons';

// Verify @whitewater-guide/validation
import { SectionFormSchema } from '@whitewater-guide/validation';
```

### Potential issues

- **React version mismatch:** Shared packages may have `react: ^18` peer dep while mobile2 uses React 19. Widen peer deps as decided in Phase 0 (`^18.2.0 || ^19.0.0`).
- **Metro resolution:** Symlinked workspace packages need proper `watchFolders` and `nodeModulesPaths` in `metro.config.js` (configured in Phase 1).
- **ESM/CJS:** `commons`, `schema`, and `validation` have dual builds. Metro should pick the CJS build via `main` field. Verify no ESM-only imports break the bundler.

### Storybook smoke story

Create a story that renders output from each workspace package to confirm the bundler resolves them at runtime:

```tsx
// WorkspacePackages.stories.tsx
export const ImportsWork = () => (
  <View>
    <Text>commons: {typeof formatDate}</Text>
    <Text>schema: {typeof SectionFormSchema}</Text>
  </View>
);
```

### Verify

- [ ] `pnpm typecheck` passes with workspace imports
- [ ] Metro bundles successfully with workspace imports
- [ ] Storybook story renders workspace package outputs
- [ ] No "unable to resolve module" errors

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

### Storybook interaction tests

For key dependencies, add interaction tests that verify they load without native crashes:

```typescript
// Example: BottomSheet.stories.tsx
export const Opens: Story = {
  play: async ({ canvas }) => {
    // Verify the bottom sheet can be expanded
    const handle = canvas.getByTestId('bottom-sheet-handle');
    await userEvent.press(handle);
  },
};
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
- [ ] Storybook interaction tests pass
- [ ] Build verification script succeeds for both platforms

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

## 3.12 — Deps not installed (handled by replacements or dropped)

The following old deps do **not** need new packages — tracked here for completeness:

| Old dep                          | Resolution                                                                         |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| `react-native-bundle-splitter`   | Use `React.lazy` + `Suspense` (built into React 18+)                               |
| `react-native-text-size`         | Use `Text.onTextLayout` callback                                                   |
| `react-native-modal-popover`     | Use Paper `Menu` component (installed in 3.3)                                      |
| `react-native-snackbar`          | Use Paper `Snackbar` component (installed in 3.3)                                  |
| `react-native-avoid-softinput`   | Replaced by `react-native-keyboard-controller` (installed in 3.8)                  |
| `react-native-big-list`          | Replaced by `@shopify/flash-list` (installed in 3.4)                               |
| `react-native-image-zoom-viewer` | Replaced by `react-native-awesome-gallery` (installed in 3.7)                      |
| `react-native-mmkv-storage`      | Replaced by `react-native-mmkv` (installed in 3.6)                                 |
| `react-native-iphone-x-helper`   | Use `useSafeAreaInsets()` from `react-native-safe-area-context` (installed in 3.2) |
| `react-native-redash`            | Inline utilities or use `react-native-reanimated` v4 built-ins (installed in 3.2)  |

## 3.13 — Final validation

- [ ] App builds and launches on iOS after **all** deps installed
- [ ] App builds and launches on Android after **all** deps installed
- [ ] Storybook launches and all smoke stories render on iOS
- [ ] Storybook launches and all smoke stories render on Android
- [ ] Workspace packages (`clients`, `schema`, `commons`, `validation`) import correctly
- [ ] TypeScript types resolve for all workspace packages
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
