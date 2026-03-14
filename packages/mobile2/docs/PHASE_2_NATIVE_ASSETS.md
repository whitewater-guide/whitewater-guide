# Phase 2: Native Assets & Platform Configuration

**Goal:** Copy all native settings and assets from the old app into the fresh RN 0.84.1 project. After this phase the app launches with the correct icon, splash screen, and app name on both platforms.

---

## 2.1 — App icons

### iOS

- Copy `AppIcon.appiconset` from `packages/mobile/ios/WhitewaterGuide/Images.xcassets/` to the mobile2 Xcode project
- Verify all required sizes are present (1024×1024 App Store icon, plus device sizes)

### Android

- Copy adaptive icon resources from `packages/mobile/android/app/src/main/res/`:
  - `mipmap-hdpi/`, `mipmap-mdpi/`, `mipmap-xhdpi/`, `mipmap-xxhdpi/`, `mipmap-xxxhdpi/`
  - `ic_launcher.xml`, `ic_launcher_round.xml` (adaptive icon definitions)
- Copy `ic_launcher_background.xml` and foreground drawable if using vector adaptive icons

## 2.2 — Fonts

- Copy custom font files from `packages/mobile/android/app/src/main/assets/fonts/` (or wherever they reside)
- iOS: Add font files to the Xcode project and register in `Info.plist` under `UIAppFonts`
- Android: Font files in `assets/fonts/` are auto-discovered by RN
- Verify fonts match what's used in the Paper theme and custom components

## 2.3 — Native localization

### iOS

- Copy `.lproj` directories from the old iOS project:
  - `InfoPlist.strings` — localized app name (`CFBundleDisplayName`), permission descriptions
  - Languages: en, ru, and any others present
- Add localization entries in Xcode project settings

### Android

- Copy `values-*/strings.xml` locale files from old Android project
  - At minimum: `values/strings.xml` (default/en), `values-ru/strings.xml`
  - Contains: `app_name`, permission rationale strings
- Verify `resConfigs` in `build.gradle` includes all supported locales

## 2.4 — Permissions & manifests

### iOS — Info.plist

Port the following usage description keys (with localized strings in `.lproj`):

| Key                                   | Purpose                             |
| ------------------------------------- | ----------------------------------- |
| `NSLocationWhenInUseUsageDescription` | Map user location                   |
| `NSCameraUsageDescription`            | Photo capture for descents/sections |
| `NSPhotoLibraryUsageDescription`      | Photo selection                     |
| `NSPhotoLibraryAddUsageDescription`   | Saving photos                       |

### iOS — Entitlements

- Push Notifications entitlement (`aps-environment`)
- Associated Domains (`applinks:whitewater.guide`, `applinks:app.whitewater.guide`)

### Android — AndroidManifest.xml

Port permissions:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

Port intent filters for deep linking:

```xml
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https" android:host="whitewater.guide" />
    <data android:scheme="https" android:host="app.whitewater.guide" />
</intent-filter>
```

**Note:** Remove Facebook-related intent filters and meta-data (social auth dropped).

## 2.5 — Splash screen

Install and configure `react-native-bootsplash` v7:

1. `pnpm add react-native-bootsplash`
2. Generate splash assets:
   ```bash
   npx react-native-bootsplash generate \
     --platforms android,ios \
     --background "#0078B4" \
     --logo ./assets/logo.png \
     --logo-width 200
   ```
3. iOS: BootSplash configures `LaunchScreen.storyboard` automatically
4. Android: BootSplash configures themes and styles automatically
5. In `App.tsx`, call `BootSplash.hide({ fade: true })` after initialization
6. Remove the default RN `LaunchScreen.storyboard` / splash theme if present

### Logo asset

- Extract or recreate the whitewater.guide logo as a clean PNG with transparency
- Source from old app's splash assets or brand materials

## 2.6 — Other native config

### iOS — Xcode build settings

- Deployment target: 15.1 (set in Phase 1, verify here)
- Swift version: match old app or use latest stable (5.9+)
- Build schemes: Debug, Staging, Release (port from old app's scheme setup)
- Pod install and verify no warnings about deployment target mismatches

### Android — Gradle settings

- `minSdk: 24`, `targetSdk: 35`, `compileSdk: 35` (set in Phase 1, verify here)
- Signing config placeholders for staging and release (actual keystores configured in Phase 14)
- Build types: debug, staging, release
- Product flavors if used in old app

### ProGuard / R8

- Copy ProGuard rules from `packages/mobile/android/app/proguard-rules.pro`
- These are seed rules — will be updated as new deps are added in Phase 3+
- Basic rules to keep: React Native, Hermes, OkHttp, Gson

### Other assets

- Copy any sound files, raw resources, or other native assets from old app
- Verify nothing is missed by diffing the old app's resource directories

## 2.7 — Validation

- [ ] App builds and launches on iOS simulator with correct app icon
- [ ] App builds and launches on Android emulator with correct app icon
- [ ] Splash screen displays blue background (#0078B4) with centered logo
- [ ] Splash screen hides after app init (shows blank/root screen)
- [ ] App name displays correctly in English
- [ ] App name displays correctly when device language is set to Russian
- [ ] iOS permission descriptions are localized (check Settings → Privacy)
- [ ] Custom fonts are accessible (can be verified with a test Text component)
- [ ] No build warnings related to missing resources or assets
- [ ] Deep link intent filters are present in Android manifest (verify with `adb shell dumpsys package`)
- [ ] iOS Associated Domains entitlement is configured (verify in Xcode signing)
