# Phase 10: Firebase, Sentry & Polish

**Goal:** Production infrastructure — push notifications, error tracking, app settings, uploads, and remaining utility screens.

---

## 10.1 — Install dependencies

```
@react-native-firebase/app (v24)
@react-native-firebase/messaging (v24)
@react-native-firebase/analytics (v24)
@sentry/react-native (v8)
```

Notes:

- `react-native-bootsplash` and `react-native-device-info` already installed in Phases 2–3.
- Install with `--ignore-scripts` per [CLAUDE.md](../CLAUDE.md). Run `pnpm add --ignore-scripts @react-native-firebase/app@^24 @react-native-firebase/messaging@^24 @react-native-firebase/analytics@^24` from `apps/mobile2`. Verify the three entries land in [package.json](../package.json).
- mobile2 already meets v24 minimums: `minSdkVersion 24` ([android/build.gradle](../android/build.gradle)), iOS deployment target inherited from RN 0.84 (`min_ios_version_supported` is 15.1, ≥ v23's iOS 15 floor). No platform bumps required.

---

## 10.2 — Firebase porting plan

### What was used in the legacy `apps/mobile` app (v14, namespaced API)

**`@react-native-firebase/messaging`** — used only for FCM token lifecycle and push permissions. **No foreground/background message handlers, no deep links from notifications.**

- [src/core/pushNotifications.ts:2-16](../../mobile/src/core/pushNotifications.ts) — `hasPermission()` → `requestPermission()` → `registerDeviceForRemoteMessages()` (iOS).
- [src/core/auth/service.ts](../../mobile/src/core/auth/service.ts) — `getToken()` on init (line 47), `onTokenRefresh()` listener (line 54), token POSTed to backend REST endpoint `/fcm/set` (line 273), and `fcm_token` body field on `/auth/local/signin`, `/auth/facebook/signin`, `/auth/apple/signin`, `/auth/local/signup`, `/auth/logout`.

**`@react-native-firebase/analytics`** — sparse usage:

- [src/core/errors/tracker.ts:48](../../mobile/src/core/errors/tracker.ts) — `logScreenView({ screen_name })` driven by [src/core/navigation/useTracking.ts](../../mobile/src/core/navigation/useTracking.ts) which hooks into `NavigationContainer` `onReady` / `onStateChange`.
- [src/features/banners/BannerView.tsx:28](../../mobile/src/features/banners/BannerView.tsx) — `logEvent('Banner_<slug>')` on banner press.
- [src/features/offline/hooks/useDownloadRegion.ts](../../mobile/src/features/offline/hooks/useDownloadRegion.ts) — `logEvent('offline_download_started' | 'offline_download_complete', { region })`.
- [src/utils/maps/openGoogleMaps.ts:16-18](../../mobile/src/utils/maps/openGoogleMaps.ts) — `setUserProperty('canOpenGoogleMaps', ...)`.

All analytics calls are wrapped in `try/catch` so they never crash the caller.

### Key v24 differences vs v14

- **Modular API is mandatory-shaped.** Namespaced calls (`messaging().getToken()`, `analytics().logEvent(...)`) still work but emit deprecation warnings and may be removed. New code should use modular imports — `getMessaging`, `getToken`, `onTokenRefresh`, `requestPermission`, `getAnalytics`, `logEvent`, `logScreenView`, `setUserProperty`.
- **iOS AppDelegate is now Swift** ([ios/whitewater/AppDelegate.swift](../ios/whitewater/AppDelegate.swift) in mobile2) — initialization changes from `[FIRApp configure]` (Obj-C) to `FirebaseApp.configure()` (Swift).
- **Static frameworks required.** Podfile must set `use_frameworks! :linkage => :static` and `$RNFirebaseAsStaticFramework = true`. mobile2's current Podfile does not have these — they must be added.
- **Android 13+ runtime permission.** `POST_NOTIFICATIONS` must be requested via `PermissionsAndroid` (not handled by old app — was pre-Android 13).

---

### 10.2.1 — iOS configuration

1. **Copy `GoogleService-Info.plist`** from [apps/mobile/ios/whitewater/GoogleService-Info.plist](../../mobile/ios/whitewater/GoogleService-Info.plist) into `apps/mobile2/ios/whitewater/` and add it to the Xcode project (drag into the `whitewater` group, "Copy if needed" off, target = `whitewater`). The bundle ID matches, so the same file applies.
2. **Edit [ios/Podfile](../ios/Podfile):**
   - Add at top of `target 'whitewater' do`:
     ```ruby
     use_frameworks! :linkage => :static
     $RNFirebaseAsStaticFramework = true
     $RNFirebaseAnalyticsWithoutAdIdSupport = true   # privacy: disable IDFA
     ```
   - Verify Flipper is not enabled (incompatible with `use_frameworks!`). RN 0.84 templates already drop Flipper.
3. **Edit [ios/whitewater/AppDelegate.swift](../ios/whitewater/AppDelegate.swift):**
   ```swift
   import Firebase
   // …
   func application(_ application: UIApplication,
                    didFinishLaunchingWithOptions launchOptions: …) -> Bool {
     FirebaseApp.configure()
     // existing RN bootstrap …
   }
   ```
4. **Xcode capabilities** (Signing & Capabilities tab on the `whitewater` target):
   - `+ Capability` → **Push Notifications**.
   - `+ Capability` → **Background Modes** → enable **Remote notifications** (and **Background fetch** if used).
     These edits land in `whitewater.entitlements` and `project.pbxproj`; commit both.
5. **APNs key** — already configured in Firebase Console for the legacy app. No new upload needed unless the Apple team ID changed.
6. Run `cd ios && pod install --repo-update`. Validate with `pnpm react-native build-ios` per [CLAUDE.md](../CLAUDE.md).

### 10.2.2 — Android configuration

1. **Copy `google-services.json`** from [apps/mobile/android/app/google-services.json](../../mobile/android/app/google-services.json) into `apps/mobile2/android/app/`. Package name matches.
2. **Edit [android/build.gradle](../android/build.gradle)** (project-level) — add to `buildscript.dependencies`:
   ```gradle
   classpath 'com.google.gms:google-services:4.4.4'
   ```
3. **Edit [android/app/build.gradle](../android/app/build.gradle)** — apply at top of file (after the `com.android.application` plugin):
   ```gradle
   apply plugin: 'com.google.gms.google-services'
   ```
4. **Edit [android/app/src/main/AndroidManifest.xml](../android/app/src/main/AndroidManifest.xml)** — add (Android 13+):
   ```xml
   <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
   ```
5. Validate with `pnpm react-native build-android` per [CLAUDE.md](../CLAUDE.md).

### 10.2.3 — TypeScript port (modular API)

**a) Push notification permission module** — port [src/core/pushNotifications.ts](../../mobile/src/core/pushNotifications.ts) to modular API:

```ts
import {
  getMessaging,
  getToken,
  onTokenRefresh,
  hasPermission,
  requestPermission,
  registerDeviceForRemoteMessages,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid } from 'react-native';

export async function ensureNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const res = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    return res === PermissionsAndroid.RESULTS.GRANTED;
  }
  const messaging = getMessaging();
  let status = await hasPermission(messaging);
  if (status === AuthorizationStatus.NOT_DETERMINED) {
    status = await requestPermission(messaging);
  }
  const ok =
    status === AuthorizationStatus.AUTHORIZED ||
    status === AuthorizationStatus.PROVISIONAL;
  if (ok && Platform.OS === 'ios') {
    await registerDeviceForRemoteMessages(messaging);
  }
  return ok;
}
```

**b) Auth service FCM integration** — in mobile2's auth provider (Phase 5/6 work), replicate the legacy lifecycle:

- On auth init: call `getToken(getMessaging())`, attach `onTokenRefresh(getMessaging(), handler)`.
- Include `fcm_token` in sign-in / sign-up / logout payloads. Check whether mobile2 still uses the same REST `/fcm/set` endpoint or has migrated to a GraphQL mutation — if unchanged, port the helper directly; if migrated, point it at the new mutation.

**c) Analytics — modular helpers in a single utility** (e.g. `src/core/analytics.ts`):

```ts
import {
  getAnalytics,
  logEvent,
  logScreenView,
  setUserProperty,
} from '@react-native-firebase/analytics';

const a = () => getAnalytics();

export const trackScreen = (name: string) =>
  logScreenView(a(), { screen_name: name, screen_class: name }).catch(() => {});

export const trackEvent = (name: string, params?: Record<string, unknown>) =>
  logEvent(a(), name, params).catch(() => {});

export const setUserProp = (key: string, value: string | null) =>
  setUserProperty(a(), key, value).catch(() => {});
```

Wire it into:

- **Screen tracking** — follow the [react-navigation screen tracking guide](https://reactnavigation.org/docs/screen-tracking). In mobile2's `NavigationRoot` (Phase 4), use `useNavigationContainerRef()` + a `routeNameRef` and hook `onReady` / `onStateChange` on `NavigationContainer`. Resolve the active route via `navigationRef.getCurrentRoute()?.name` (do **not** read it from the `state` argument — nested navigators require `getCurrentRoute`). Fire `trackScreen` in `onReady` (since `onStateChange` does not run on initial render) and in `onStateChange` only when `previousRouteName !== currentRouteName`. The legacy [useTracking](../../mobile/src/core/navigation/useTracking.ts) hook already implements this shape and can be ported almost verbatim:

  ```tsx
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef<string | undefined>(undefined);

  const handleStateChange = () => {
    const previous = routeNameRef.current;
    const current = navigationRef.getCurrentRoute()?.name;
    if (current && previous !== current) {
      trackScreen(current);
    }
    routeNameRef.current = current;
  };

  <NavigationContainer
    ref={navigationRef}
    onReady={handleStateChange}
    onStateChange={handleStateChange}
  >
    …
  </NavigationContainer>;
  ```

- **Banners** — `trackEvent('Banner_' + slug.replace(/-/g, '_'))` on press.
- **Offline downloads** — `trackEvent('offline_download_started' | 'offline_download_complete', { region })`.
- **Google Maps capability** — `setUserProp('canOpenGoogleMaps', ...)` once on first map open.

**d) Background message handler** — legacy app didn't have one. **Skip** unless product wants it; if added later, register `setBackgroundMessageHandler` in [index.js](../index.js) (must be at module top level, before app registration).

---

## 10.3 — Sentry setup

Target version: **`@sentry/react-native` v8.10+** (latest as of writing). Peer deps `react ≥ 17`, `react-native ≥ 0.65` are already satisfied by mobile2.

### What was used in the legacy `apps/mobile` app

- [src/core/errors/configErrors.ts](../../mobile/src/core/errors/configErrors.ts) — `Sentry.init({ dsn, environment, beforeBreadcrumb })` with a noisy-breadcrumb filter (drops `console`, `device.orientation`, `ui.lifecycle`, successful `xhr/http`, dev server traffic, battery state, gesture-handler `handleTouch*`).
- [src/core/errors/tracker.ts](../../mobile/src/core/errors/tracker.ts) — singleton with a `_queue` that buffers `track()` calls until `ready()` runs (so errors thrown before `Sentry.init` resolved are not lost). Methods: `track` → `Sentry.captureException(error, { tags: { logger }, extra })`, `trackScreen` → `Sentry.addBreadcrumb({ type: 'navigation', … })`, `setUser` → `Sentry.setUser`.
- [src/core/errors/trackError.ts](../../mobile/src/core/errors/trackError.ts) — thin `(logger, error, extra)` wrapper used throughout the app (e.g. [src/core/apollo/createLink.ts:25](../../mobile/src/core/apollo/createLink.ts) inside `errorLink`).
- [src/components/ErrorBoundary.tsx](../../mobile/src/components/ErrorBoundary.tsx) — wraps `Sentry.ErrorBoundary` (currently imported from `@sentry/react`, **port to `@sentry/react-native` in mobile2** — same API, correct package).
- [src/App.tsx:118-174](../../mobile/src/App.tsx) — `export default Sentry.wrap(App, { profilerProps, touchEventBoundaryProps })` with a long `ignoreNames` list to suppress noisy touch breadcrumbs from RN/Paper/navigation internals.

### Key v8 differences vs the legacy v5/v6 install

- **`reactNavigationIntegration`** replaces ad-hoc `addBreadcrumb({ type: 'navigation', … })` and the deprecated `ReactNavigationInstrumentation`. It auto-instruments routes, transitions, and time-to-initial-display when wired through the navigation container ref.
- **Source maps upload** moved to a wrapper script (`sentry-xcode.sh` / `sentry.gradle`) — drop-in replacement for the legacy `react-native-xcode.sh` build phase.
- **Metro plugin** (`@sentry/react-native/metro`) is now required to inject debug IDs into bundles.
- **Static frameworks compatible** — already enabled for Firebase in [10.2.1](#1021--ios-configuration), no extra Podfile work.

---

### 10.3.1 — Install

```
pnpm add --ignore-scripts @sentry/react-native@^8
```

Per [CLAUDE.md](../CLAUDE.md): run from `apps/mobile2`, then verify `package.json` has the entry. Run `cd ios && pod install` after the JS install completes.

### 10.3.2 — Metro config

Edit [metro.config.js](../metro.config.js) — wrap the exported config with Sentry's serializer wrapper so debug IDs are embedded in every bundle:

```js
const { getSentryExpoConfig } = require('@sentry/react-native/metro'); // RN, not just Expo
// or, for non-Expo RN:
const { withSentryConfig } = require('@sentry/react-native/metro');

// existing mergeConfig(getDefaultConfig(__dirname), customConfig)
module.exports = withSentryConfig(config);
```

(For RN CLI projects use `withSentryConfig`; `getSentryExpoConfig` is Expo-only. mobile2 is bare RN → use `withSentryConfig`.)

### 10.3.3 — iOS configuration

1. **Source maps build phase.** In Xcode, open the `whitewater` target → Build Phases → "Bundle React Native code and images" and replace its script with:
   ```bash
   set -e
   WITH_ENVIRONMENT="$REACT_NATIVE_PATH/scripts/xcode/with-environment.sh"
   SENTRY_XCODE="../node_modules/@sentry/react-native/scripts/sentry-xcode.sh"
   /bin/sh -c "$WITH_ENVIRONMENT $SENTRY_XCODE"
   ```
2. **Debug symbols upload.** Add a new Run Script build phase **after** "Bundle React Native code and images":
   ```bash
   /bin/sh ../node_modules/@sentry/react-native/scripts/sentry-xcode-debug-files.sh
   ```
3. **`.xcode.env.local`** (gitignored) — add:
   ```bash
   export SENTRY_PROPERTIES=sentry.properties
   ```
4. **`ios/sentry.properties`** (gitignored — add to [.gitignore](../.gitignore)):
   ```properties
   defaults.url=https://sentry.io/
   defaults.org=<org-slug>
   defaults.project=<project-slug>
   auth.token=${SENTRY_AUTH_TOKEN}
   ```
   Reuse the legacy app's org/project slugs and rotate or copy `SENTRY_AUTH_TOKEN` from CI secrets. **Do not commit the auth token.**
5. **Podfile** — no edits needed; `pod install` picks up `RNSentry` automatically. Static frameworks (already configured for Firebase) are compatible.
6. **AppDelegate** — no native init call. `Sentry.init` runs from JS in [10.3.5](#1035--typescript-port).

### 10.3.4 — Android configuration

1. **Edit [android/app/build.gradle](../android/app/build.gradle)** — add at the top, after the existing `apply plugin` lines:
   ```gradle
   apply from: new File(["node", "--print", "require.resolve('@sentry/react-native/package.json')"].execute(null, rootDir).text.trim(), "../sentry.gradle")
   ```
   (This resolves through the pnpm-hoisted `node_modules`. Adjust if hoisting changes.)
2. **`android/sentry.properties`** (gitignored) — same format as iOS:
   ```properties
   defaults.url=https://sentry.io/
   defaults.org=<org-slug>
   defaults.project=<project-slug>
   auth.token=${SENTRY_AUTH_TOKEN}
   ```
3. **Optional: Sentry Android Gradle Plugin** (only if native crash symbolication is needed). In [android/build.gradle](../android/build.gradle):
   ```gradle
   classpath("io.sentry:sentry-android-gradle-plugin:4.+")
   ```
   In `android/app/build.gradle`:
   ```gradle
   apply plugin: "io.sentry.android.gradle"
   sentry {
     uploadNativeSymbols = true
     includeNativeSources = true
     autoInstallation { enabled = false }   // MUST be false with React Native
   }
   ```
4. Validate with `pnpm react-native build-android` per [CLAUDE.md](../CLAUDE.md).

### 10.3.5 — TypeScript port

**a) `src/core/errors/configErrors.ts`** — port verbatim from the legacy file, modular API stays the same. Build the `reactNavigationIntegration` instance here so it can be exported and registered with the navigation container in [10.3.6](#1036--wire-into-navigationroot):

```ts
import * as Sentry from '@sentry/react-native';
import Config from 'react-native-config';
import { tracker } from './tracker';

export const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});

export const configErrors = () => {
  Sentry.init({
    dsn: Config.SENTRY_DSN,
    environment: Config.ENV_NAME,
    integrations: [navigationIntegration],
    // Tune these per environment if volume becomes a problem:
    tracesSampleRate: __DEV__ ? 0 : 0.1,
    beforeBreadcrumb: (breadcrumb) => {
      const { category = 'default', data = {}, message = '' } = breadcrumb;
      const statusCode = Number(data.status_code);
      const url: string | undefined = data.url;
      if (
        ['console', 'device.orientation', 'ui.lifecycle'].includes(category) ||
        (['xhr', 'http'].includes(category) &&
          (statusCode === 0 ||
            (statusCode >= 200 && statusCode < 300) ||
            url?.includes('localhost:8081'))) ||
        (category === 'device.event' &&
          data.action === 'BATTERY_STATE_CHANGE') ||
        (category === 'touch' && message.startsWith('handleTouch'))
      ) {
        return null;
      }
      return breadcrumb;
    },
  });
  tracker.ready();
};
```

Notes:

- `react-native-ultimate-config` (legacy) is replaced by `react-native-config` (already in mobile2's [package.json](../package.json)). Confirm `SENTRY_DSN` and `ENV_NAME` are declared in the env files used by `react-native-config`.
- Drop `Sentry.ReactNativeTracing` — `reactNavigationIntegration` covers it in v8.

**b) `src/core/errors/tracker.ts`** — port the queueing pattern as-is. The screen-tracking breadcrumb is no longer needed (the navigation integration adds richer ones), so the `trackScreen` method can be removed unless a caller still relies on it:

```ts
import * as Sentry from '@sentry/react-native';
import { trackEvent } from '../analytics'; // from 10.2.3(c)

interface Trace {
  logger: string;
  error: unknown;
  extra?: Record<string, any>;
}

class ErrorTracker {
  private _queue: Trace[] = [];
  private _ready = false;

  ready = () => {
    this._ready = true;
    this._queue.forEach(this.track);
    this._queue = [];
  };

  track = (trace: Trace) => {
    if (__DEV__) console.log(trace.error);
    if (!this._ready) {
      this._queue.push(trace);
      return;
    }
    Sentry.captureException(trace.error, {
      tags: { logger: trace.logger },
      extra: trace.extra,
    });
  };

  setUser = (user: Sentry.User | null) => Sentry.setUser(user);
}

export const tracker = new ErrorTracker();
```

**c) `src/core/errors/trackError.ts`** — copy verbatim from the legacy file (5 lines, no changes needed).

**d) Apollo `errorLink` integration** — replicate [createLink.ts:17-30](../../mobile/src/core/apollo/createLink.ts) when porting Apollo (Phase 5/6): suppress `'Network request failed'` to avoid Sentry spam when offline.

**e) `ErrorBoundary` component** — port [src/components/ErrorBoundary.tsx](../../mobile/src/components/ErrorBoundary.tsx) but **fix the import** to `@sentry/react-native` (legacy used `@sentry/react`, which works but ships browser-only code). Same `fallback` + `beforeCapture` API.

**f) Hook `configErrors()` early.** Call it at the top of [src/App.tsx](../src/App.tsx), **before** the `App` class definition — it must run before any other module captures an error. Mirror the legacy `configErrors(); configMisc();` pattern.

### 10.3.6 — Wire into NavigationRoot

In `NavigationRoot` (Phase 4), register the `navigationIntegration` ref alongside the analytics screen-tracking from [10.2.3(c)](#1023--typescript-port-modular-api). The two share the same `navigationRef`:

```tsx
import { useNavigationContainerRef } from '@react-navigation/native';
import { navigationIntegration } from '~/core/errors/configErrors';
import { trackScreen } from '~/core/analytics';

const navigationRef = useNavigationContainerRef();
const routeNameRef = useRef<string | undefined>(undefined);

const handleStateChange = () => {
  const previous = routeNameRef.current;
  const current = navigationRef.getCurrentRoute()?.name;
  if (current && previous !== current) trackScreen(current);
  routeNameRef.current = current;
};

<NavigationContainer
  ref={navigationRef}
  onReady={() => {
    navigationIntegration.registerNavigationContainer(navigationRef);
    handleStateChange();
  }}
  onStateChange={handleStateChange}
>
  …
</NavigationContainer>;
```

### 10.3.7 — Wrap the root component

In [src/App.tsx](../src/App.tsx), replace `export default App` with:

```ts
export default Sentry.wrap(App);
```

Skip the legacy `profilerProps` / `touchEventBoundaryProps.ignoreNames` list unless touch breadcrumbs prove noisy in practice — v8's defaults are saner. If noise reappears, port the legacy `ignoreNames` array as a starting point.

### 10.3.8 — Verification

1. Add a temporary `throw new Error('Sentry smoke test');` inside a button handler, run a release build, confirm the event lands in the Sentry dashboard with a symbolicated stack trace (proves source maps uploaded).
2. Navigate between two screens, then trigger an error — confirm the breadcrumb trail shows the navigation transition emitted by `reactNavigationIntegration`.
3. Sign in, trigger an error — confirm the user appears on the Sentry event (proves `tracker.setUser` is wired into the auth provider).

---

## 10.4 — Remaining features

Status snapshot of work originally scoped here:

| Item                  | Status                | Notes                                                                                                                                                                     |
| --------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AppSettingsProvider` | ✅ Ported             | [src/features/settings/AppSettingsProvider.tsx](../src/features/settings/AppSettingsProvider.tsx) — see [10.4.1](#1041--appsettingsprovider-already-ported)               |
| `UploadsProvider`     | ✅ Ported             | [src/features/uploads/UploadsProvider.tsx](../src/features/uploads/UploadsProvider.tsx) — see [10.4.2](#1042--uploadsprovider-already-ported)                             |
| Banners               | ⚠️ No provider needed | The legacy app never had a `BannersProvider`; banners are nested in the region GraphQL query (`region.banners.nodes`). See [10.4.3](#1043--banners-no-dedicated-provider) |
| Suggestion screen     | ❌ Placeholder        | [10.4.4](#1044--suggestion-screen)                                                                                                                                        |
| WebView screen        | ❌ Placeholder        | [10.4.5](#1045--webview-screen)                                                                                                                                           |
| License screen        | ❌ Placeholder        | [10.4.6](#1046--license-screen)                                                                                                                                           |
| Plain text screen     | ❌ Placeholder        | [10.4.7](#1047--plain-text-screen)                                                                                                                                        |

All four placeholder screens are already wired into the navigator as `PlaceholderScreen` and have correct param types declared in [src/core/navigation/navigation-params.ts](../src/core/navigation/navigation-params.ts). Porting work is JS-only — no native changes, no new dependencies (WebView, Markdown component, and license metadata already exist in mobile2 or are easy to re-add).

---

### 10.4.1 — `AppSettingsProvider` (already ported)

Already at [src/features/settings/AppSettingsProvider.tsx](../src/features/settings/AppSettingsProvider.tsx). Differences from legacy:

- **Storage swapped from AsyncStorage → MMKV** (`react-native-mmkv@4`). Synchronous reads let `useState` initialize from storage in one shot — no async loading flicker, no "settings not yet loaded" branch needed in consumers.
- Storage key: `'@ww-settings'` (preserved for forward-compat if a future migration ever wants to read legacy values; not currently migrated).
- API surface unchanged: `useAppSettings()` returns `{ settings, updateSettings(partial) }`. State shape is `{ mapType, seenSwipeableSectionTip }`.

No further work required. Verify any new feature reading settings calls `useAppSettings()` rather than touching MMKV directly.

### 10.4.2 — `UploadsProvider` (already ported)

Already at [src/features/uploads/UploadsProvider.tsx](../src/features/uploads/UploadsProvider.tsx). Logic is a direct port of the legacy provider:

- In-memory `Record<id, LocalPhoto>` keyed by photo id, no persistence — uploads in flight do not survive app restart (matches legacy behavior).
- `useLocalPhotos()` returns `{ localPhotos, upload(photo) }`. Status transitions `READY → UPLOADING → READY (with url)` or error.
- Upload itself is delegated to `useUploadLink()` from `@whitewater-guide/clients`; backend endpoint resolution lives there, so the provider does not need updating when the upload endpoint changes.
- Errors are caught and stored on the photo via `i18nizeUploadError()`; UI surfaces them and is responsible for retry.

No further work required. The Suggestion screen ([10.4.4](#1044--suggestion-screen)) is the main consumer once it's ported.

### 10.4.3 — Banners (no dedicated provider)

The original Phase 10 scope listed a `BannersProvider`, but the legacy app does not have one — banners are returned inline by the region query and rendered by [`RegionBanners`](../../mobile/src/features/banners/RegionBanners.tsx) using `getBannersForPlacement(region.banners.nodes, placement, count)`. There is no dismissal state, no separate fetch, no storage.

**Action:** when the region screens get banner placements wired up, port:

- [src/features/banners/RegionBanners.tsx](../../mobile/src/features/banners/RegionBanners.tsx) — placement-filtered renderer.
- [src/features/banners/ImageBanner.tsx](../../mobile/src/features/banners/ImageBanner.tsx) — `FastImage` + `Linking.openURL` press handler. Replace `react-native-fast-image` with whatever image lib mobile2 standardizes on (check existing usage before adding a new dep).
- [src/features/banners/getBannersForPlacement.ts](../../mobile/src/features/banners/getBannersForPlacement.ts) — pure helper, copy verbatim.
- The `trackEvent('Banner_<slug>')` call from [10.2.3(c)](#1023--typescript-port-modular-api) goes in the press handler.

The `BannerWithSourceFragment` GraphQL fragment is already shared via `packages/schema`, so no codegen changes needed.

### 10.4.4 — Suggestion screen

**Legacy:** [src/screens/suggestion/SuggestionScreen.tsx](../../mobile/src/screens/suggestion/SuggestionScreen.tsx) + `PhotoSuggestionForm.tsx` + `SimpleSuggestionForm.tsx` + `useAddSuggestion.ts`.

**Route:** `Suggestion` in [src/core/navigation/navigation-params.ts](../src/core/navigation/navigation-params.ts) — params `{ sectionId: string, localPhotoId?: string }`. Currently a `PlaceholderScreen` in [src/core/navigation/RootStack.tsx](../src/core/navigation/RootStack.tsx).

**Two modes** chosen by `localPhotoId` presence:

- **Photo suggestion** — fields: photo (from `useLocalPhotos()`), copyright, description. Submits via `addSuggestion` mutation with the uploaded photo URL.
- **Simple suggestion** — text-only description.

**Port steps:**

1. Create `src/screens/suggestion/SuggestionScreen.tsx` mirroring the legacy layout: switch on `localPhotoId`, set header title from `screens:suggestion.<photo|simple>.title`.
2. Port `PhotoSuggestionForm` and `SimpleSuggestionForm`. They use Formik + Yup — verify mobile2's form pattern; the recent `descent-form` and `add-section` screens are reference implementations, and the validation schema for suggestions already exists in `packages/validation`.
3. Port the `useAddSuggestion` hook: wraps `useAddSuggestionMutation()` (codegen output) plus offline check via `@react-native-community/netinfo` (already in mobile2) plus snackbar feedback via the existing `SnackbarProvider`. Navigate back on success.
4. Remove the placeholder registration in `RootStack.tsx` and import the real screen.
5. **Analytics:** no event in the legacy app — leave as-is unless product wants to start tracking suggestion submissions.

### 10.4.5 — WebView screen

**Legacy:** [src/screens/webview/WebViewScreen.tsx](../../mobile/src/screens/webview/WebViewScreen.tsx) (~50 lines).

**Route:** `WebView` in navigation-params — `{ fixture: string, title: string }`. Used for FAQ, terms, privacy, backers.

**How it works:** loads `${WEB_URL}/${lang}/${fixture}.html` in a `react-native-webview`. Language resolved via `markdown[fixture][i18n.language]` (from `@whitewater-guide/translations/markdown`), falling back to `'en'`. Has an Android crash workaround: gates rendering on `useFocusEffect` so the WebView is unmounted when the screen blurs.

**Port steps:**

1. Confirm `react-native-webview` is installed in mobile2; add via `pnpm add --ignore-scripts react-native-webview` per [CLAUDE.md](../CLAUDE.md) if missing. This adds native code → run `pod install` and validate both platform builds.
2. Create `src/screens/webview/WebViewScreen.tsx` as a near-verbatim copy. Replace `React.FC<WebViewNavProps>` with the function-component style mobile2 uses (typed props, no `React.FC`).
3. `WEB_URL` lives in `react-native-config` env (`Config.WEB_URL`). Confirm the var is declared in mobile2's env files.
4. Keep the `useFocusEffect` gating — the Android crash it works around is in `react-native-webview` itself, not RN, and is still present.
5. Remove the placeholder registration; wire screen options for `headerTitle` from route params.

### 10.4.6 — License screen

**Legacy:** [src/screens/license/LicenseScreen.tsx](../../mobile/src/screens/license/LicenseScreen.tsx) (~20 lines).

**Route:** `License` in navigation-params — `{ placement: string, copyright?: string, license: object }`.

**How it works:** trivial — renders `<LicenseBadge placement copyright license />` inside a `Screen` with padding. All logic is in `LicenseBadge`.

**Port steps:**

1. Port [src/components/LicenseBadge](../../mobile/src/components/LicenseBadge) (component + types) into mobile2. Copy verbatim, then fix any imports that point at legacy paths.
2. Create `src/screens/license/LicenseScreen.tsx` — function component reading `route.params`, rendering `<LicenseBadge>`.
3. Remove the placeholder registration.
4. The `license` param is the SPDX-style metadata object from gauge/section banners; its shape is dictated by the GraphQL schema and is already typed in `packages/schema` — no new types needed.

### 10.4.7 — Plain text screen

**Legacy:** [src/screens/plain/PlainTextScreen.tsx](../../mobile/src/screens/plain/PlainTextScreen.tsx) (~35 lines).

**Route:** `PlainText` in navigation-params — `{ text: string | null, title: string }`.

**How it works:** `ScrollView` containing `<Markdown>{text}</Markdown>` with padded content. Header title set via `setOptions`. Used for short legal/info copy that doesn't justify a WebView round-trip.

**Port steps:**

1. Port the `Markdown` component from [src/components/Markdown](../../mobile/src/components/Markdown). It wraps `react-native-markdown-display` (or whichever renderer the legacy app uses — verify and bring the same dep). Confirm it themes against mobile2's `paperTheme`.
2. Create `src/screens/plain/PlainTextScreen.tsx` — function component, `useLayoutEffect` (preferred over `useEffect` for nav header sync to avoid a frame of "Untitled") to set `headerTitle` from params.
3. Guard the empty case with `{!!text && <Markdown>{text}</Markdown>}` — `null` is allowed by the param type.
4. Remove the placeholder registration.

---

## 10.5 — Provider stack: current vs. final

Mobile2's current stack is in [src/App.tsx:59-89](../src/App.tsx#L59-L89). It already covers most of what Phase 10 originally scoped — this section reconciles the original target stack against what's actually built and lists the remaining additions.

### Current stack (in [src/App.tsx](../src/App.tsx))

```
GestureHandlerRootView
└─ AppSettingsProvider
   └─ ActionSheetProvider
      └─ PaperProvider
         └─ KeyboardProvider
            └─ SafeAreaProvider
               └─ ApolloProvider
                  └─ UploadsProvider
                     └─ TagsProvider
                        └─ AuthProvider
                           └─ DescentFormDraftProvider
                              └─ AddSectionDraftProvider
                                 └─ I18nProvider
                                    └─ SnackbarProvider
                                       └─ NavigationRoot
```

### Removed from the original Phase 10 plan

- **`ChatClientStateProvider`** — chat feature dropped from mobile2 scope.
- **`IapProvider`** — in-app purchases dropped from mobile2 scope.
- **`OfflineContentProvider`** — offline regions are not in scope for the initial mobile2 release; revisit when offline support is prioritized.
- **`RegionsFilterProvider`** — replaced by per-screen state / Apollo cache; no global filter context needed in mobile2.
- **`BannersProvider`** — never existed in legacy either (see [10.4.3](#1043--banners-no-dedicated-provider)).

### Additions in mobile2 not in the original plan

- `KeyboardProvider` — `react-native-keyboard-controller`, replaces ad-hoc `KeyboardAvoidingView` patterns from the legacy app.
- `SafeAreaProvider` — was implicit in legacy; explicit here.
- `DescentFormDraftProvider` and `AddSectionDraftProvider` — local-form draft persistence, scoped to those flows.
- `SnackbarProvider` — replaces the legacy app's ad-hoc snackbar usage with a single context-driven queue.

### Remaining additions for Phase 10

The Sentry and Firebase work in [10.2](#102--firebase-porting-plan) and [10.3](#103--sentry-setup) is mostly side-effectful (`Sentry.init`, `getMessaging`, screen-tracking on `NavigationContainer`) and does **not** add provider wrappers. The only structural changes needed:

1. **Wrap the export with `Sentry.wrap`** ([10.3.7](#1037--wrap-the-root-component)) — `export default Sentry.wrap(App);` outside the provider tree.
2. **Hook `configErrors()` early** ([10.3.5(f)](#1035--typescript-port)) — call at module top, before `App` is defined, so `Sentry.init` runs before any provider mounts.
3. **`navigationIntegration.registerNavigationContainer(navigationRef)`** in `NavigationRoot`'s `onReady` ([10.3.6](#1036--wire-into-navigationroot)) — no new provider, just a ref hookup.

### Final target stack

Same as current, plus the changes above. Diagrammatically:

```
Sentry.wrap(
  GestureHandlerRootView
  └─ AppSettingsProvider
     └─ ActionSheetProvider
        └─ PaperProvider
           └─ KeyboardProvider
              └─ SafeAreaProvider
                 └─ ApolloProvider
                    └─ UploadsProvider
                       └─ TagsProvider
                          └─ AuthProvider
                             └─ DescentFormDraftProvider
                                └─ AddSectionDraftProvider
                                   └─ I18nProvider
                                      └─ SnackbarProvider
                                         └─ NavigationRoot   // registers navigationIntegration on ready
)
```

### Ordering notes (why the current order is correct)

- `AppSettingsProvider` outermost so theme/UI tips are available before any visible UI mounts.
- `PaperProvider` above `KeyboardProvider` — Paper's `Portal` host needs to be the ancestor of any keyboard-aware sheet.
- `ApolloProvider` above `UploadsProvider`, `TagsProvider`, `AuthProvider` — all three either fire mutations or read cached data on mount.
- `AuthProvider` above the form-draft providers — drafts are scoped per user; they need to react to sign-in/out.
- `I18nProvider` above `SnackbarProvider` — snackbar messages are translated.
- `SnackbarProvider` directly above `NavigationRoot` — keeps the snackbar mount point near the navigation surface so it overlays correctly.

---

## 10.6 — Validation

- [ ] Push notifications received on both platforms
- [ ] Sentry captures errors and shows in dashboard
- [ ] App settings persist across restarts
- [ ] Photo uploads work end-to-end
- [ ] **Unit tests:** Firebase messaging mock, upload provider
- [ ] **Detox E2E:** Full app flow — launch → splash → sign in → browse → receive notification
