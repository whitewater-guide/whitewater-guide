# Phase 2: Port Native Assets & Platform Configuration to mobile2

> Part of the [Mobile2 Migration Plan](MIGRATION_PLAN.md). Follows [Phase 1](PHASE_1_ENVIRONMENT.md) (environment & tooling setup).

## Context

Phase 1 is complete — mobile2 is a fresh RN 0.84.1 app building on both platforms with Detox.
Now we need to port native assets and platform config from the old app (`apps/mobile`) so
the app launches with the correct icon, splash screen, app name, permissions, and deep linking.

**Scope decisions:**

- **Skip**: Facebook SDK (social auth dropped), SectionItemViewManager (will be JS in later phase), Firebase/Sentry (Phase 3), notification icons (later)
- **Include**: App icons, splash screen (BootSplash), fonts (react-native-vector-icons), permissions, deep linking, localization, build variants, entitlements, ProGuard seed rules, environment config

---

## Step 1: App Icons

### What changed since RN 0.72

Since Xcode 15+ (required by RN 0.84), iOS app icons can use a **single 1024x1024 PNG** instead of providing every size manually. Xcode auto-generates all required sizes from the single source. The old app's `Contents.json` lists 9 separate icon files for different sizes — this is the legacy approach.

On Android, nothing has changed for launcher icons. Adaptive icons (introduced in Android 8) are still the standard.

**Docs:**

- Apple: https://developer.apple.com/documentation/xcode/configuring-your-app-icon
- Android adaptive icons: https://developer.android.com/develop/ui/views/launch/icon_design_adaptive

### 1a. iOS — Generate app icon from source artwork

**Assuming you have the original 1024x1024 app icon PNG:**

1. Place it at `apps/mobile2/assets/app-icon.png`
2. In Xcode, open `Images.xcassets` → `AppIcon`
3. Xcode 15+ uses a "Single Size" mode by default — just drag the 1024x1024 into the single slot
4. Update `Contents.json` to use single-size format:

```json
{
  "images": [
    {
      "filename": "app-icon.png",
      "idiom": "universal",
      "platform": "ios",
      "size": "1024x1024"
    }
  ],
  "info": {
    "author": "xcode",
    "version": 1
  }
}
```

**If you don't have the original artwork**, extract from old app: copy `apps/mobile/ios/whitewater/Images.xcassets/AppIcon.appiconset/Icon.png` (1024x1024) as the source.

**Verification:**

- Open Xcode → Images.xcassets → AppIcon — should show the icon in the single-size slot
- Build and run on iOS simulator — home screen should show the correct icon

### 1b. Android — Generate launcher icons from source artwork

**Recommended tool:** Android Studio's Image Asset Studio, or a CLI tool like `android-icon-resizer`.

1. Open Android Studio → right-click `res` → New → Image Asset
2. Select your 1024x1024 source icon
3. Configure foreground layer, background color, shape (round/squircle)
4. Generate — it will produce `ic_launcher.png` and `ic_launcher_round.png` for all densities

**Alternatively**, copy the existing icons from the old app:

```
apps/mobile/android/app/src/main/res/mipmap-*/ic_launcher.png
apps/mobile/android/app/src/main/res/mipmap-*/ic_launcher_round.png
```

→ into `apps/mobile2/android/app/src/main/res/mipmap-*/` (overwriting defaults).

Also copy `mipmap-ldpi/ic_launcher.png` if present.

**Verification:**

- Build and run on Android emulator — app drawer and home screen should show the correct icon
- Both regular and round variants should display correctly

---

## Step 2: Splash Screen (react-native-bootsplash)

### What changed since RN 0.72

`react-native-bootsplash` has been significantly rewritten. Key differences:

- **v6 (old app)** used `Theme.SplashScreen` from `androidx.core:core-splashscreen` on Android and a custom storyboard on iOS
- **v7 (current)** generates all assets via CLI, creates a `manifest.json` for JS-side animations, and uses `Theme.BootSplash` as the Android parent theme. The API changed: `BootSplash.hide()` still works, but there's also a new `useHideAnimation` hook for animated transitions
- iOS initialization changed from `RNBootSplash.initWithStoryboard:rootView:` on `AppDelegate` to using `customize(_ rootView:)` override on `ReactNativeDelegate` (for RN 0.79+)
- Android uses `RNBootSplash.init(activity, R.style.BootTheme)` in `onCreate` before `super.onCreate`

**Docs:**

- https://github.com/zoontek/react-native-bootsplash (README covers v7 setup)

### 2a. Prepare logo artwork

**Assuming you have the original logo as a high-res PNG (or SVG):**

1. Create `apps/mobile2/assets/` directory
2. Place your logo file there (e.g., `assets/bootsplash_logo.png` or `assets/bootsplash_logo.svg`)
3. SVG is preferred if available — the generator handles it better

**If you only have the old app's assets:** Extract the highest-res version:

```bash
cp apps/mobile/ios/whitewater/Images.xcassets/BootSplashLogo.imageset/bootsplash_logo@3x.png \
   apps/mobile2/assets/bootsplash_logo.png
```

### 2b. Install react-native-bootsplash

```bash
cd apps/mobile2
pnpm add react-native-bootsplash
cd ios && pod install && cd ..
```

### 2c. Generate splash assets

```bash
cd apps/mobile2
npx react-native-bootsplash generate assets/bootsplash_logo.png \
  --platforms=android,ios \
  --background=0078B4 \
  --logo-width=128 \
  --assets-output=assets/bootsplash
```

This generates:

- **iOS:** `BootSplash.storyboard` in the Xcode project, `BootSplashLogo` imageset in `Images.xcassets`
- **Android:** `bootsplash_logo.png` in `mipmap-*` dirs, `BootTheme` style in `values/styles.xml`, background color in `values/colors.xml`
- **JS:** `assets/bootsplash/manifest.json` + scaled logo PNGs for use with `useHideAnimation`

Review the generated files and verify the logo looks correct at the specified width (128pt — same as old app).

### 2d. iOS — Update Info.plist launch storyboard

**File:** `apps/mobile2/ios/whitewater/Info.plist`

**Change:** `UILaunchStoryboardName` from `LaunchScreen` → `BootSplash`

### 2e. iOS — Initialize BootSplash in AppDelegate.swift

**File:** `apps/mobile2/ios/whitewater/AppDelegate.swift`

Add BootSplash initialization using the RN 0.79+ pattern:

```swift
import RNBootSplash

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func customize(_ rootView: RCTRootView) {
    super.customize(rootView)
    RNBootSplash.initWithStoryboard("BootSplash", rootView: rootView)
  }
  // ... existing bundleURL code ...
}
```

### 2f. Android — Initialize BootSplash in MainActivity.kt

**File:** `apps/mobile2/android/app/src/main/java/guide/whitewater/MainActivity.kt`

```kotlin
import android.os.Bundle
import com.zoontek.rnbootsplash.RNBootSplash

class MainActivity : ReactActivity() {
  // ... existing code ...

  override fun onCreate(savedInstanceState: Bundle?) {
    RNBootSplash.init(this, R.style.BootTheme)
    super.onCreate(savedInstanceState)
  }
}
```

### 2g. Android — Update theme in AndroidManifest.xml

**File:** `apps/mobile2/android/app/src/main/AndroidManifest.xml`

**Change:** `android:theme` from `@style/AppTheme` → `@style/BootTheme`

The generator should have created `BootTheme` in `values/styles.xml` inheriting from `Theme.BootSplash` with `postSplashScreenTheme` pointing to `AppTheme`.

### 2h. JS — Hide splash screen

**File:** `apps/mobile2/src/App.tsx`

Add `BootSplash.hide({ fade: true })` in a `useEffect`:

```tsx
import BootSplash from 'react-native-bootsplash';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    BootSplash.hide({ fade: true });
  }, []);
  // ...
}
```

### Verification (all of Step 2):

- Build and run on iOS simulator — blue (#0078B4) splash with centered logo, fades to app
- Build and run on Android emulator — same splash behavior
- No white flash before splash appears
- Logo is centered and properly sized

---

## Step 3: Display Name & Bundle Configuration

### What changed since RN 0.72

RN 0.84 template uses Xcode build settings variables (`$(MARKETING_VERSION)`, `$(PRODUCT_NAME)`) in Info.plist instead of hardcoded values. This is the modern Xcode approach and should be preserved. On Android, the Gradle plugin structure changed significantly (see Phase 1), but build types/variants work the same way.

### 3a. iOS — Info.plist display name & project settings

**File:** `apps/mobile2/ios/whitewater/Info.plist`

**Changes:**

- Set `CFBundleDisplayName` to `whitewater.guide`
- Add `<key>ITSAppUsesNonExemptEncryption</key><false/>` (avoids App Store compliance question on every upload)
- Remove `UISupportedInterfaceOrientations~ipad` key and its array (dead config — app is iPhone-only)

**File:** `apps/mobile2/ios/whitewater.xcodeproj/project.pbxproj`

**Changes:**

- Change `TARGETED_DEVICE_FAMILY = "1,2"` → `TARGETED_DEVICE_FAMILY = "1"` (iPhone only, matching old app) — in both Debug and Release build configs

**Verification:**

- Build iOS — home screen label should say "whitewater.guide"
- Xcode target → General → Deployment Info shows iPhone only

### 3b. Android — Build variant app names and signing

**File:** `apps/mobile2/android/app/build.gradle`

**Changes to `buildTypes`:**

```groovy
buildTypes {
    debug {
        signingConfig signingConfigs.debug
        resValue "string", "app_name", "WW DEBUG"
        applicationIdSuffix ".staging"
    }
    release {
        signingConfig signingConfigs.debug  // placeholder until Phase 14
        minifyEnabled enableProguardInReleaseBuilds
        proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        proguardFile "${rootProject.projectDir}/../../../node_modules/detox/android/detox/proguard-rules-app.pro"
        resValue "string", "app_name", "whitewater.guide"
    }
    releaseStaging {
        initWith release
        applicationIdSuffix ".staging"
        resValue "string", "app_name", "WW STAGING"
        matchingFallbacks = ['release']
    }
}
```

Add release signing config placeholder:

```groovy
signingConfigs {
    debug { /* existing */ }
    release {
        storeFile file(String.valueOf(System.getenv("GRADLE_KEYSTORE") ?: "debug.keystore"))
        storePassword System.getenv("GRADLE_KEYSTORE_PASSWORD") ?: "android"
        keyAlias System.getenv("GRADLE_KEYSTORE_ALIAS") ?: "androiddebugkey"
        keyPassword System.getenv("GRADLE_KEYSTORE_ALIAS_PASSWORD") ?: "android"
    }
}
```

Remove the static `app_name` from `res/values/strings.xml` (replaced by `resValue` per build type).

**Verification:**

- Build debug on Android — app label shows "WW DEBUG"
- `adb shell pm list packages | grep whitewater` shows `guide.whitewater.staging`

### 3c. Version Continuity

The old app is at version 1.21.1 (build 355 on iOS, versionCode 1817096202 on Android). The new app must use higher version numbers to be accepted as an update by the App Store and Play Store.

**File:** `apps/mobile2/package.json`

- Change `"version": "0.0.1"` → `"version": "1.22.0"`

**File:** `apps/mobile2/ios/whitewater.xcodeproj/project.pbxproj`

In both Debug and Release target build configs (4 changes total):

- Change `MARKETING_VERSION = 1.0` → `MARKETING_VERSION = 1.22.0`
- Change `CURRENT_PROJECT_VERSION = 1` → `CURRENT_PROJECT_VERSION = 356`

**File:** `apps/mobile2/android/app/build.gradle`

In `defaultConfig`:

- Change `versionCode 1` → `versionCode 1817096203` (old app's 1817096202 + 1)
- Change `versionName "1.0"` → `versionName "1.22.0"`

**Note:** When the Staging Xcode build configuration is created in Step 10, it must also get `MARKETING_VERSION = 1.22.0` and `CURRENT_PROJECT_VERSION = 356`.

**Verification:**

- Xcode → target → General shows Version 1.22.0, Build 356
- `./gradlew assembleDebug` produces APK with versionName 1.22.0

### 3d. Environment Configuration (react-native-config)

The old app used `react-native-ultimate-config` (abandoned) to inject environment-specific values at build time. The replacement is `react-native-config`.

**Docs:**

- https://github.com/lugg/react-native-config

#### Install

```bash
cd apps/mobile2
pnpm add react-native-config
cd ios && pod install && cd ..
```

#### Create environment files

Port from old app's `.env.*.yml` (YAML) to `.env.*` (dotenv) format, dropping Facebook keys (auth dropped).

**Files to create:** `.env` (development), `.env.staging`, `.env.production`, `.env.test`

**Keys** (all files use the same keys, values differ per environment):

```
ENV_NAME=
E2E_MODE=
BACKEND_PROTOCOL=
BACKEND_HOST=
DEEP_LINKING_DOMAIN=
STATIC_CONTENT_URL_BASE=
CHAT_HOST=
MAPBOX_ACCESS_TOKEN=
SENTRY_DSN=
```

Copy values from the corresponding old app files (`apps/mobile/.env.development.yml`, etc.), converting from YAML to dotenv format.

**Dropped keys** (vs old app):

| Key                          | Reason                                                                               |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| `FACEBOOK_APP_ID`            | Facebook auth dropped                                                                |
| `FACEBOOK_CUSTOM_URL_SCHEME` | Facebook auth dropped                                                                |
| `FACEBOOK_CLIENT_TOKEN`      | Facebook auth dropped                                                                |
| `MAPBOX_DOWNLOADS_TOKEN`     | Build-time only (goes in `android/local.properties` and env vars, not in app config) |

**Important:** Add `.env*` to `.gitignore` (these contain tokens).

#### TypeScript type declarations

**Create:** `apps/mobile2/src/types/react-native-config.d.ts`

```typescript
declare module 'react-native-config' {
  export interface NativeConfig {
    ENV_NAME: string;
    E2E_MODE: string;
    BACKEND_PROTOCOL: string;
    BACKEND_HOST: string;
    DEEP_LINKING_DOMAIN: string;
    STATIC_CONTENT_URL_BASE: string;
    CHAT_HOST: string;
    MAPBOX_ACCESS_TOKEN: string;
    SENTRY_DSN: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
```

#### Android — Wire build variants to env files

**File:** `apps/mobile2/android/app/build.gradle`

Add to the top (after existing `apply` lines):

```groovy
project.ext.envConfigFiles = [
    debug: ".env",
    release: ".env.production",
    releaseStaging: ".env.staging",
]
apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"
```

This automatically loads the correct `.env` file for each build type.

#### iOS — Wire schemes to env files

In Xcode, set the `ENVFILE` build setting per configuration:

- Debug: `.env`
- Staging: `.env.staging`
- Release: `.env.production`

Or use the `react-native-config` Podfile hook (see library docs).

#### JS usage

```typescript
import Config from 'react-native-config';

const apiUrl = `${Config.BACKEND_PROTOCOL}://${Config.BACKEND_HOST}`;
const deepLinkDomain = Config.DEEP_LINKING_DOMAIN;
```

**Verification:**

- `console.log(Config.ENV_NAME)` shows `development` in debug build
- `console.log(Config.BACKEND_HOST)` shows expected API host
- TypeScript autocomplete works for Config keys

---

## Step 4: Orientation Lock

### What changed since RN 0.72

No changes — orientation is still controlled the same way on both platforms.

### iOS — Already correct

Mobile2's Info.plist already has portrait-only for iPhone. No change needed.

### Android — Lock to portrait

**File:** `apps/mobile2/android/app/src/main/AndroidManifest.xml`

**Change:** Add `android:screenOrientation="portrait"` to the `<activity>` element.

**Verification:**

- Run on Android, rotate device — app stays in portrait

---

## Step 5: Permissions

### What changed since RN 0.72

iOS permission model is unchanged. Android 13+ (API 33) introduced granular media permissions (`READ_MEDIA_IMAGES` etc.) replacing `READ_EXTERNAL_STORAGE`/`WRITE_EXTERNAL_STORAGE`. Since our minSdk is 24 and targetSdk is 36, we should use the new permissions when needed (deferred to when photo-picking deps are added). The old app's `READ_EXTERNAL_STORAGE`/`WRITE_EXTERNAL_STORAGE` are not needed now.

**Docs:**

- Android permissions: https://developer.android.com/develop/privacy/permissions
- iOS Info.plist keys: https://developer.apple.com/documentation/bundleresources/information-property-list

### 5a. iOS — Permission descriptions in Info.plist

**File:** `apps/mobile2/ios/whitewater/Info.plist`

**Replace** the existing empty `NSLocationWhenInUseUsageDescription` and **add** new keys:

```xml
<key>NSCameraUsageDescription</key>
<string>This permission is required to upload your photos</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>It needs this permission to show you how close you are to this or that river</string>
<key>NSLocationAlwaysUsageDescription</key>
<string>It needs this permission to show you how close you are to this or that river</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>It needs this permission to show you how close you are to this or that river</string>
<key>NSPhotoLibraryAddUsageDescription</key>
<string>This permission is required to upload your photos</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This permission is required to upload your photos</string>
```

**Also add** `LSApplicationQueriesSchemes` — required for `Linking.canOpenURL('comgooglemaps://')` to work (used in `openGoogleMaps.ts`). Without this, iOS silently returns `false` and the app can't detect the Google Maps native app.

```xml
<key>LSApplicationQueriesSchemes</key>
<array>
    <string>comgooglemaps</string>
</array>
```

**Note:** Old app also had Facebook URL schemes (`fbapi`, `fbauth`, etc.) and `googlechromes` — skip both (Facebook dropped, `googlechromes` was unused in code).

**Verification:**

- Open Info.plist in Xcode — verify all 6 permission keys with non-empty text
- Verify `LSApplicationQueriesSchemes` contains `comgooglemaps`

### 5b. Android — Manifest permissions

**File:** `apps/mobile2/android/app/src/main/AndroidManifest.xml`

**Add** `xmlns:tools` namespace and permissions:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
          xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.READ_PHONE_STATE" tools:node="remove"/>
    <uses-permission android:name="com.google.android.gms.permission.AD_ID" tools:node="remove"/>
```

**Note:** Old app had `BILLING` (IAP dropped in mobile2) and `VIBRATE` (declared but never used in code) — both intentionally omitted.

**Verification:**

- Build Android: `adb shell dumpsys package guide.whitewater.staging | grep permission`
- Should include INTERNET, ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION, ACCESS_NETWORK_STATE
- Should NOT include READ_PHONE_STATE, AD_ID, BILLING, or VIBRATE

---

## Step 6: Deep Linking

### What changed since RN 0.72

- RN 0.84 uses Swift `AppDelegate` instead of ObjC `AppDelegate.mm`. Deep linking setup uses `RCTLinkingManager` the same way, but in Swift syntax
- Android deep linking is unchanged
- Android App Links verification (autoVerify) remains the same

**Docs:**

- RN Linking: https://reactnative.dev/docs/linking
- iOS Universal Links: https://developer.apple.com/documentation/xcode/supporting-universal-links-in-your-app
- Android App Links: https://developer.android.com/training/app-links

### 6a. iOS — Entitlements file

**Create:** `apps/mobile2/ios/whitewater/whitewater.entitlements`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>aps-environment</key>
    <string>development</string>
    <key>com.apple.developer.applesignin</key>
    <array>
        <string>Default</string>
    </array>
    <key>com.apple.developer.associated-domains</key>
    <array>
        <string>applinks:whitewater.guide</string>
        <string>applinks:app.whitewater.guide</string>
        <string>applinks:whitewater-dev.com</string>
        <string>applinks:app.whitewater-dev.com</string>
    </array>
</dict>
</plist>
```

**Also:** Add the entitlements file reference to Xcode project. In Xcode: select target → Build Settings → search "entitlements" → set `CODE_SIGN_ENTITLEMENTS` to `whitewater/whitewater.entitlements`. Or edit `.pbxproj` directly.

### 6b. iOS — Deep linking in AppDelegate.swift

**File:** `apps/mobile2/ios/whitewater/AppDelegate.swift`

**Add** to the `AppDelegate` class:

```swift
import React_RCTLinkingManager

// URL scheme handling
func application(
  _ app: UIApplication,
  open url: URL,
  options: [UIApplication.OpenURLOptionsKey: Any] = [:]
) -> Bool {
  return RCTLinkingManager.application(app, open: url, options: options)
}

// Universal links handling
func application(
  _ application: UIApplication,
  continue userActivity: NSUserActivity,
  restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
) -> Bool {
  return RCTLinkingManager.application(application, continue: userActivity, restorationHandler: restorationHandler)
}
```

### 6c. Android — Deep link intent filter

**File:** `apps/mobile2/android/app/src/main/AndroidManifest.xml`

**Add** second intent filter inside `<activity>`, using `react-native-config` build variables (set up in Step 3d):

```xml
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="@string/BACKEND_PROTOCOL" android:host="@string/DEEP_LINKING_DOMAIN" />
</intent-filter>
```

`react-native-config`'s `dotenv.gradle` plugin automatically generates Android string resources from `.env` values, so `@string/BACKEND_PROTOCOL` and `@string/DEEP_LINKING_DOMAIN` resolve per build variant from the active env file.

### Verification (all of Step 6):

- iOS Xcode → Signing & Capabilities → verify Associated Domains lists all 4 applinks
- Android: `adb shell am start -a android.intent.action.VIEW -d "https://whitewater.guide" guide.whitewater.staging` — app opens
- iOS: `xcrun simctl openurl booted "https://whitewater.guide"` — app opens

---

## Step 7: Localization

### What changed since RN 0.72

No changes in how native localization works on either platform. `.lproj` directories and `InfoPlist.strings` are still the standard.

### 7a. iOS — Create .lproj directories

**Create** these 4 files:

`apps/mobile2/ios/whitewater/en.lproj/InfoPlist.strings`:

```
"NSLocationAlwaysAndWhenInUseUsageDescription" = "It needs this permission to show you how close you are to this or that river";
"NSLocationWhenInUseUsageDescription" = "It needs this permission to show you how close you are to this or that river";
```

`apps/mobile2/ios/whitewater/ru.lproj/InfoPlist.strings`:

```
"NSLocationAlwaysAndWhenInUseUsageDescription" = "Это нужно чтобы вы могли понять как близко к той или иной реке вы находитесь";
"NSLocationWhenInUseUsageDescription" = "Это нужно чтобы вы могли понять как близко к той или иной реке вы находитесь";
```

`apps/mobile2/ios/en.lproj/InfoPlist.strings` (root-level duplicate):

```
"NSLocationAlwaysAndWhenInUseUsageDescription" = "It needs this permission to show you how close you are to this or that river";
"NSLocationWhenInUseUsageDescription" = "It needs this permission to show you how close you are to this or that river";
```

`apps/mobile2/ios/ru.lproj/InfoPlist.strings` (root-level duplicate):

```
"NSLocationAlwaysAndWhenInUseUsageDescription" = "Это нужно чтобы вы могли понять как близко к той или иной реке вы находитесь";
"NSLocationWhenInUseUsageDescription" = "Это нужно чтобы вы могли понять как близко к той или иной реке вы находитесь";
```

**Also:** Add `.lproj` directories to the Xcode project and add "en", "ru" to known regions in Project → Info → Localizations.

### Verification:

- Change iOS simulator language to Russian (Settings → General → Language & Region)
- Check Settings → Privacy → Location Services → whitewater — text should be in Russian

---

## Step 8: Fonts (react-native-vector-icons)

### What changed since RN 0.72

**Major breaking change:** `react-native-vector-icons` v12+ has migrated from a single monolithic package to individual scoped packages under `@react-native-vector-icons/*`. The old `react-native-vector-icons` (v10 used by old app) is now on the legacy `10.x` branch.

Key differences:

- Old: `import Icon from 'react-native-vector-icons/MaterialCommunityIcons'`
- New: `import MaterialCommunityIcons from '@react-native-vector-icons/material-community-icons'`
- No more manual `fonts.gradle` or manual `Info.plist` font entries — autolinking handles it
- iOS: `pod install` auto-links the font. Use `npx rnvi-update-plist` to update Info.plist
- Android: Fonts are auto-linked, no `fonts.gradle` needed

**Docs:**

- https://github.com/oblador/react-native-vector-icons (v12+ README)
- https://github.com/oblador/react-native-vector-icons/blob/master/MIGRATION.md
- https://github.com/oblador/react-native-vector-icons/blob/master/docs/SETUP-REACT-NATIVE.md

### 8a. Install packages

```bash
cd apps/mobile2
pnpm add @react-native-vector-icons/material-icons @react-native-vector-icons/material-community-icons
cd ios && pod install && cd ..
```

### 8b. iOS — Update Info.plist fonts

```bash
cd apps/mobile2
npx rnvi-update-plist package.json ios/whitewater/Info.plist
```

This automatically adds the correct font filenames to the `UIAppFonts` array.

**Or manually** add to Info.plist:

```xml
<key>UIAppFonts</key>
<array>
    <string>MaterialIcons.ttf</string>
    <string>MaterialCommunityIcons.ttf</string>
</array>
```

Note: font filenames may differ in v12 (e.g., `MaterialDesignIcons.ttf`). Check the package's actual font files after install.

### 8c. Verify with a test component

**File:** `apps/mobile2/src/App.tsx`

Temporarily add an icon to verify fonts load:

```tsx
import MaterialCommunityIcons from '@react-native-vector-icons/material-community-icons';
import MaterialIcons from '@react-native-vector-icons/material-icons';

// In the render:
<MaterialCommunityIcons name="map" size={30} color="blue" />
<MaterialIcons name="star" size={30} color="gold" />
```

### Verification:

- Build and run on iOS — both icons render correctly (not missing-glyph squares)
- Build and run on Android — both icons render correctly
- Remove test icons from App.tsx after verification

---

## Step 9: ProGuard Rules (seed)

### What changed since RN 0.72

RN 0.84 with New Architecture uses TurboModules and Fabric, which changes some ProGuard requirements. However, the Hermes rules remain the same. Many old rules (Flipper, react-native-ultimate-config) are no longer needed.

### Action

**File:** `apps/mobile2/android/app/proguard-rules.pro`

Add only the seed rules for deps we'll definitely use:

```proguard
# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }
```

Other rules (react-native-svg, react-native-iap, etc.) will be added when those deps are installed.

### Also: Enable ProGuard for release

**File:** `apps/mobile2/android/app/build.gradle`

**Change:** `def enableProguardInReleaseBuilds = false` → `true`

### Verification:

- `cd apps/mobile2/android && ./gradlew assembleRelease` — builds without ProGuard errors
- App starts correctly from release build

---

## Step 10: Staging Build Configurations (iOS + Android)

### What changed since RN 0.72

No changes in how Xcode build configurations or Android build types work. The Podfile format is simpler in RN 0.84 (no Flipper, no Fabric flags), but the `project` declaration for custom configs is the same.

### 10a. iOS Podfile — Add Staging configuration

**File:** `apps/mobile2/ios/Podfile`

**Add** before `target 'whitewater'`:

```ruby
project 'whitewater',
  'Debug' => :debug,
  'Staging' => :release,
  'Release' => :release
```

### 10b. iOS Xcode — Create Staging build configuration

In Xcode: Project (not target) → Info → Configurations → tap "+" → Duplicate "Release" → name it "Staging".

Or edit the `project.pbxproj` to add the Staging configuration to all configuration lists.

**Important:** The Staging config must inherit the version values set in Step 3c: `MARKETING_VERSION = 1.22.0` and `CURRENT_PROJECT_VERSION = 356`.

### 10c. Android — Add releaseStaging build type

**File:** `apps/mobile2/android/app/build.gradle`

The `releaseStaging` build type with `resValue` for app name is already defined in Step 3b's `buildTypes` block. This step calls it out explicitly as the Android parallel to the iOS Staging configuration.

Key properties of `releaseStaging`:

- `initWith release` — inherits minification, ProGuard, signing from release
- `applicationIdSuffix ".staging"` — installs as `guide.whitewater.staging` alongside production
- `resValue "string", "app_name", "WW STAGING"` — distinguishable in app drawer
- `matchingFallbacks = ['release']` — uses release variants for dependencies that don't define releaseStaging

The `react {}` block does NOT need `debuggableVariants` modification — default debuggable variants are `["debug", "debugOptimized"]`, so `releaseStaging` will be bundled (not debuggable) as intended.

**Optional:** Add Detox config for staging in `.detoxrc.js`:

```js
'android.releaseStaging': {
    type: 'android.apk',
    binaryPath: 'android/app/build/outputs/apk/releaseStaging/app-releaseStaging.apk',
    build: 'cd android && ./gradlew assembleReleaseStaging assembleAndroidTest -DtestBuildType=releaseStaging',
}
```

### Verification:

- `xcodebuild -project ios/whitewater.xcodeproj -list` — shows Debug, Staging, Release
- `cd ios && pod install` — succeeds with no warnings about unknown configurations
- `cd android && ./gradlew assembleReleaseStaging` — builds successfully
- Staging APK has applicationId `guide.whitewater.staging` and app name "WW STAGING"

---

## Execution Order

1. **Step 1** — App icons (pure file/asset work)
2. **Step 2** — BootSplash (install, generate, configure native, JS hide)
3. **Step 3** — App naming, build variants, versions, environment config
4. **Step 4** — Orientation lock
5. **Step 5** — Permissions
6. **Step 6** — Deep linking + entitlements (uses config from Step 3d)
7. **Step 7** — Localization
8. **Step 8** — react-native-vector-icons (install, configure, test)
9. **Step 9** — ProGuard rules + enable for release
10. **Step 10** — Staging build configurations (iOS + Android)

## Final Verification Checklist

- [ ] `pnpm install` succeeds from monorepo root
- [ ] iOS builds and runs with correct app icon
- [ ] Android builds and runs with correct app icon
- [ ] Splash screen: blue (#0078B4) background, centered logo, fades to app on both platforms
- [ ] iOS home screen shows "whitewater.guide" as app name
- [ ] Android debug build shows "WW DEBUG" as app name
- [ ] Android stays in portrait when device rotated
- [ ] iOS Info.plist has all 6 permission keys with text
- [ ] `LSApplicationQueriesSchemes` includes `comgooglemaps`
- [ ] Android manifest has location and network state permissions (no BILLING or VIBRATE)
- [ ] `react-native-config` loads correct env values per build variant
- [ ] iOS entitlements file has associated domains and push notifications
- [ ] Deep links open the app on both platforms
- [ ] iOS: Russian permission descriptions appear when device in Russian
- [ ] MaterialIcons and MaterialCommunityIcons render on both platforms
- [ ] Release build with ProGuard succeeds on Android
- [ ] Xcode shows Debug, Staging, Release configurations
- [ ] Android `releaseStaging` builds: `./gradlew assembleReleaseStaging`
- [ ] Staging APK has applicationId `guide.whitewater.staging` and app name "WW STAGING"
- [ ] `MARKETING_VERSION` in Xcode shows 1.22.0, build number 356
- [ ] Android versionName is 1.22.0, versionCode is 1817096203
- [ ] package.json version is 1.22.0
- [ ] `TARGETED_DEVICE_FAMILY` is "1" (iPhone only)
- [ ] No `UISupportedInterfaceOrientations~ipad` key in Info.plist
- [ ] `pnpm typecheck` passes for mobile2
- [ ] Detox basic test still passes
