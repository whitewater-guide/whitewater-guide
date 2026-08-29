import type { ExpoConfig } from 'expo/config';

const PHOTO_PERMISSION =
  'This permission is required to upload your photos';
const LOCATION_PERMISSION =
  'It needs this permission to show you how close you are to this or that river';

/**
 * Native store identity and platform settings ported from apps/mobile.
 *
 * Deferred to later sessions:
 * - Firebase (google-services.json / GoogleService-Info.plist are gitignored)
 * - Facebook URL scheme / SDK meta-data
 * - Sign in with Apple and IAP entitlements
 * - Mapbox download tokens
 * - Env-driven config (react-native-config / RNUC)
 * - Fastlane / EAS submit profiles
 * - Android staging applicationId suffix (guide.whitewater.staging)
 */
const config: ExpoConfig = {
  name: 'whitewater.guide',
  slug: 'whitewater-guide',
  scheme: 'whitewater',
  version: '1.22.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  userInterfaceStyle: 'automatic',
  primaryColor: '#0078B4',
  locales: {
    en: './locales/en.json',
    ru: './locales/ru.json',
  },
  ios: {
    bundleIdentifier: 'guide.whitewater',
    buildNumber: '356',
    supportsTablet: false,
    appleTeamId: '922TKPGBXZ',
    associatedDomains: [
      'applinks:whitewater.guide',
      'applinks:app.whitewater.guide',
      'applinks:whitewater-dev.com',
      'applinks:app.whitewater-dev.com',
    ],
    infoPlist: {
      CFBundleDisplayName: 'whitewater.guide',
      CFBundleName: 'whitewater guide',
      NSCameraUsageDescription: PHOTO_PERMISSION,
      NSPhotoLibraryUsageDescription: PHOTO_PERMISSION,
      NSPhotoLibraryAddUsageDescription: PHOTO_PERMISSION,
      NSLocationWhenInUseUsageDescription: LOCATION_PERMISSION,
      NSLocationAlwaysUsageDescription: LOCATION_PERMISSION,
      NSLocationAlwaysAndWhenInUseUsageDescription: LOCATION_PERMISSION,
    },
  },
  android: {
    package: 'guide.whitewater',
    versionCode: 1817096203,
    allowBackup: false,
    predictiveBackGestureEnabled: false,
    permissions: [
      'android.permission.INTERNET',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_NETWORK_STATE',
      'android.permission.VIBRATE',
      'android.permission.RECEIVE_BOOT_COMPLETED',
    ],
    blockedPermissions: [
      'android.permission.READ_PHONE_STATE',
      'com.google.android.gms.permission.AD_ID',
    ],
    adaptiveIcon: {
      foregroundImage: './assets/images/icon.png',
      backgroundColor: '#0078B4',
    },
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          {
            scheme: 'https',
            host: 'app.whitewater.guide',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    'expo-localization',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#0078B4',
        image: './assets/images/splash-icon.png',
        imageWidth: 224,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
