# Phase 5: Mapbox Integration

**Goal:** App displays Mapbox maps on the region map tab, validates that `@rnmapbox/maps@10.3.0-rc.0` works with RN 0.84.1 on both platforms.

---

## 5.1 — Mapbox dependency

`@rnmapbox/maps@10.3.0-rc.0` is already installed and build-verified from Phase 3. Mapbox native SDK configuration (Maven repo, download tokens) was also set up in Phase 3.

Proceed directly to app-level Mapbox integration.

## 5.2 — Configure Mapbox — Android (verify)

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

2. Add download token to `android/local.properties` (gitignored):

   ```
   MAPBOX_DOWNLOADS_TOKEN=sk.eyJ1Ijo...
   ```

3. Add Mapbox access token to `AndroidManifest.xml` or pass via `MapboxGL.setAccessToken()` at runtime.

## 5.3 — Configure Mapbox — iOS (verify)

1. Add Mapbox pod source in `ios/Podfile`:

   ```ruby
   source 'https://github.com/nicklockwood/Podfile.git'

   # For Mapbox v11
   pod 'MapboxMaps', :modular_headers => true
   ```

2. Create `~/.netrc` (or verify it exists) with Mapbox credentials:

   ```
   machine api.mapbox.com
     login mapbox
     password sk.eyJ1Ijo...
   ```

3. Run `cd ios && pod install`

## 5.4 — Initialize Mapbox in app

Create `src/core/config/configMapbox.ts`:

```typescript
import MapboxGL from '@rnmapbox/maps';

export function configMapbox(accessToken: string) {
  MapboxGL.setAccessToken(accessToken);
}
```

Call from `App.tsx` during initialization, using access token from `react-native-config`.

## 5.5 — Build basic map screen

Create `src/components/map/Map.tsx`:

- Renders `MapboxGL.MapView` with default center (e.g., Europe center: lat 48, lng 10, zoom 4)
- Supports map style switching (streets / satellite) via `useMapType()` setting
- Renders `MapboxGL.Camera` with initial bounds

Wire into Region Tabs → Map tab (replace the placeholder).

## 5.6 — Build map UI components

| Component            | Purpose                                 |
| -------------------- | --------------------------------------- |
| `BaseMap.tsx`        | Map container with default config       |
| `CameraControls.tsx` | Zoom in/out, locate user buttons        |
| `LayersSelector.tsx` | Toggle streets/satellite/outdoors       |
| `MapLayoutBase.tsx`  | Layout wrapper for map + overlay panels |

These are initially simple — full GeoJSON overlays (sections, POIs) come in Phase 8 (Region Detail).

## 5.7 — User location

- Request location permission (`react-native-permissions` or RN built-in `PermissionsAndroid`)
- Show user location dot on map via `MapboxGL.UserLocation`
- "Center on me" button in `CameraControls`

## 5.8 — Validation

- [ ] Map renders and loads tiles on iOS simulator
- [ ] Map renders and loads tiles on Android emulator
- [ ] Map renders on iOS real device
- [ ] Map style switches between streets and satellite
- [ ] User location dot appears (real device or emulator with simulated location)
- [ ] Camera controls (zoom, center) work
- [ ] No Mapbox token errors in logs
- [ ] **Unit tests:** `configMapbox()` sets token, `LayersSelector` renders layer options
- [ ] **Storybook:** `BaseMap` story with different initial regions, `LayersSelector` story
- [ ] **Detox E2E:** Navigate to region → map tab visible → map tiles loaded (check for map view element)

## 5.9 — Troubleshooting checklist

If maps don't render:

1. Check Mapbox access token is set (`MapboxGL.getAccessToken()`)
2. Check download token in `local.properties` / `~/.netrc`
3. Android: verify Maven repo resolved in Gradle sync
4. iOS: verify `pod install` succeeded and Mapbox pod is linked
5. Check Mapbox SDK version compatibility with `@rnmapbox/maps@10.3.0-rc.0`
6. Check New Architecture compatibility — if issues, test with `newArchEnabled=false` to isolate
