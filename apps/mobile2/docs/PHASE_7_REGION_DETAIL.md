# Phase 7: Region Detail (maps + sections list + info)

**Goal:** Full region browsing experience: map tab with section overlays, sections list tab with swipe-to-navigate, and info tab with markdown description.

---

## Architectural decisions

### Bottom sheet usage

Two overlay surfaces in this phase:

| Use case                                                            | Solution                                     | Why                                                                                                                                   |
| ------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **SelectedSectionSheet / SelectedPOISheet** (overlay on active map) | `@gorhom/bottom-sheet` v5 `BottomSheetModal` | Must float over a live map; programmatic open/dismiss based on map selection state; two snap points with tap-to-expand                |
| **FilterScreen** (filter options with scrollable content)           | Standard stack push (`presentation: 'card'`) | Scrollable content; not a good candidate for form sheet (fitToContents would be too small); simpler and consistent across iOS/Android |

`BottomSheetModalProvider` must wrap the region screen tree. Place it inside `MapSelectionProvider`.

```tsx
<BottomSheetModalProvider>
  <MapSelectionProvider>
    {/* Tab navigator */}
    {hasData && <RegionFAB />}
    <SectionsProgress />
  </MapSelectionProvider>
</BottomSheetModalProvider>
```

---

### Mapbox `@rnmapbox/maps@10.3.0-rc.0` — notable changes from 10.0.x

#### 1. Camera: ref-based imperative API (already the pattern we use)

The old app's `useCamera()` + `camera.setCamera({...})` pattern is the **correct approach** for v10. Camera props like `bounds`, `centerCoordinate`, `zoomLevel` still work for initial positioning, but programmatic movement uses the ref.

```tsx
// Old BaseMap: Camera ref stored via setter context — keep this pattern
<Camera ref={setCamera} {...bounds} animationDuration={0} />
```

No changes needed to the `CameraProvider` / `useCamera` / `useCameraSetter` pattern.

#### 2. `UserLocation` → `LocationPuck`

`UserLocation`'s `renderMode` prop is **deprecated**. Replace with the `LocationPuck` component:

```tsx
// Old (deprecated renderMode)
<UserLocation visible renderMode={UserTrackingMode.Follow} />;

// New (mobile2)
import { LocationPuck } from '@rnmapbox/maps';
// In BaseMap, after permission check:
{
  locationPermissionGranted && appState === 'active' && (
    <LocationPuck visible />
  );
}
```

`LocationPuck` uses the native platform location indicator (the blue dot on iOS, filled circle on Android) and does not require `renderMode`.

#### 3. `@react-native-community/hooks` dropped — replace `useAppState`

Old `BaseMap` imports `useAppState` from `@react-native-community/hooks` (dropped from mobile2). Replace with a custom hook using RN's `AppState`:

```ts
// hooks/useAppState.ts
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

export function useAppState() {
  const [state, setState] = useState(AppState.currentState);
  useEffect(() => {
    const sub = AppState.addEventListener('change', setState);
    return () => sub.remove();
  }, []);
  return state;
}
```

#### 4. `onUserTrackingModeChange` — deprecated

Remove from `Camera` props if present. Use `Viewport#onStatusChanged` if tracking state changes need to be observed (unlikely for this phase).

#### 5. Mapbox v11 style support

v10.3 adds Mapbox v11 style config (slots, `ModelLayer`). Our usage (standard `styleURL` + layer styles) is unaffected.

#### 6. ShapeSource, LineLayer, CircleLayer, SymbolLayer — API unchanged

The `FeaturesMap` implementation ports directly. Expression syntax, `filter`, `hitbox`, `onPress` on ShapeSource are all stable.

#### 7. `localizeLabels` — still supported

No changes needed.

---

### Markdown: `react-native-enriched-markdown`

**Replace `@ronradtke/react-native-markdown-display`** with [`react-native-enriched-markdown`](https://github.com/software-mansion-labs/react-native-enriched-markdown).

|                       | `@ronradtke/react-native-markdown-display` | `react-native-enriched-markdown`   |
| --------------------- | ------------------------------------------ | ---------------------------------- |
| Architecture          | Old Architecture (bridge)                  | New Architecture (Fabric) required |
| Maintained by         | Community fork                             | Software Mansion                   |
| RN 0.84 support       | Unofficial                                 | Native (RN 0.81–0.84 target)       |
| LaTeX / RTL           | No                                         | Yes                                |
| Native text selection | No                                         | Yes                                |

`react-native-enriched-markdown` requires New Architecture — mobile2 uses New Architecture ✓.

Install and remove the old package:

```bash
pnpm add --ignore-scripts react-native-enriched-markdown
pnpm remove @ronradtke/react-native-markdown-display
```

API (display only):

```tsx
import { EnrichedMarkdownText } from 'react-native-enriched-markdown';

// Replaces: <Markdown>{region.description}</Markdown>
<EnrichedMarkdownText>{region.description}</EnrichedMarkdownText>;
```

The `Markdown` wrapper component becomes a thin alias around `EnrichedMarkdownText`.

---

### Sections list swipe: `Reanimated Swipeable`

The old `Swipeable.tsx` uses deprecated Reanimated v3 APIs (`useAnimatedGestureHandler`, `PanGestureHandler`) and `react-native-redash`'s `snapPoint` (both dropped in mobile2). Rebuild using the official `Reanimated Swipeable` component from `react-native-gesture-handler` (already installed):

```tsx
import { ReanimatedSwipeable } from 'react-native-gesture-handler/ReanimatedSwipeable';
```

Key differences from old custom `Swipeable`:

**Position shared value:** `ReanimatedSwipeable` passes `(progressAnimatedValue, dragAnimatedValue)` to `renderRightActions`. The `dragAnimatedValue` is a `SharedValue<number>` representing pixel translation — equivalent to `position` in the old implementation. Pass it down to `SectionUnderlay`.

**Only-one-open coordination:** Maintain a `SwipeableListProvider` context with a `useRef<ReanimatedSwipeable | null>` tracking the currently open item. When a new item opens (`onSwipeableWillOpen`), call `close()` on the previously open ref.

**Recycling:** When a list item is recycled in FlashList, the `id` prop changes but the `Swipeable` component may be reused. Close the swipeable when `id` changes:

```tsx
const swipeRef = useRef<ReanimatedSwipeable>(null);
useEffect(() => {
  swipeRef.current?.close();
}, [id]); // id changes on recycle
```

**`snapPoint` utility:** Not needed — `ReanimatedSwipeable` handles snapping internally based on friction/velocity.

---

### Header items

#### Filter button: `headerRight`

Use standard `options.headerRight` for the filter button — works on both iOS and Android:

```tsx
options={{
  headerRight: () => <FilterButton />,
}}
```

FilterScreen is navigated to via a standard stack push. It has scrollable content (filter chips, difficulty sliders) and is not a candidate for a form sheet.

#### Search bar: `headerSearchBar`

Use react-navigation's `headerSearchBar` option for native text search in the sections list header:

```tsx
// Sections list screen options
options={{
  headerSearchBar: {
    placeholder: t('region:sections.searchPlaceholder'),
    onChangeText: (e) => setSearchQuery(e.nativeEvent.text),
    autoCapitalize: 'none',
  },
}}
```

This renders a native `UISearchController` on iOS and `SearchView` on Android. The `searchQuery` state drives a client-side filter on top of the existing `useSectionsList` data (filter by `section.river.name + section.name`). This is a **new feature** not present in the old app.

**Note:** iOS-only `cancelButtonText` can be customized; Android appearance follows the app bar theme.

---

## 7.1 — Install dependencies

Install all missing packages before any implementation. Packages already in `package.json` are noted as already installed.

```bash
# From apps/mobile2/
pnpm add --ignore-scripts \
  @turf/boolean-point-in-polygon \
  @turf/helpers \
  @turf/line-to-polygon \
  @turf/bbox \
  react-native-enriched-markdown

pnpm remove @ronradtke/react-native-markdown-display
```

After installing, verify in `apps/mobile2/package.json`, then validate native builds (`react-native-enriched-markdown` is a native module):

```bash
pnpm react-native build-ios
pnpm react-native build-android
```

| Package                                    | Status               | Reason                                                                 |
| ------------------------------------------ | -------------------- | ---------------------------------------------------------------------- |
| `@turf/boolean-point-in-polygon`           | install              | `useInRegionLocation` — check if user location is within region bounds |
| `@turf/helpers`                            | install              | `point()`, `lineString()` utilities for turf                           |
| `@turf/line-to-polygon`                    | install              | Convert region bounds LineString to Polygon for point-in-polygon test  |
| `@turf/bbox`                               | install              | Compute bounding box from region bounds for camera framing             |
| `react-native-enriched-markdown`           | install              | Replaces `@ronradtke/react-native-markdown-display`                    |
| `@ronradtke/react-native-markdown-display` | **remove**           | Replaced by enriched-markdown                                          |
| `@shopify/flash-list`                      | ✅ already installed | FlashList for sections list                                            |
| `react-native-pager-view`                  | ✅ already installed | Region tabs pager                                                      |
| `react-native-tab-view`                    | ✅ already installed | Region tabs view                                                       |
| `@gorhom/bottom-sheet`                     | ✅ already installed | Map overlay panels                                                     |
| `react-native-gesture-handler`             | ✅ already installed | `ReanimatedSwipeable`                                                  |
| `react-native-reanimated`                  | ✅ already installed | Animations for swipe underlay                                          |

---

## 7.2 — Shared components + Storybook

Build and story-test shared components. For components that contain any data-fetching or navigation logic, split into:

- `FooView` — pure presentation (props only, no hooks with side effects)
- `Foo` — thin container that calls hooks and passes data to `FooView`

Stories live alongside components. Build stories first, use Storybook to validate visually before wiring production context.

### 7.2.1 — `DifficultyThumb`

**Source:** `apps/mobile/src/components/DifficultyThumb.tsx`

Pure view — receives `difficulty: number | null` and `difficultyXtra: string | null`. No split needed.

```
src/components/DifficultyThumb.tsx
src/components/DifficultyThumb.stories.tsx
```

Stories: difficulty 1–6, null, with/without Xtra suffix.

### 7.2.2 — `FlowsThumb`

**Source:** `apps/mobile/src/components/FlowsThumb.tsx`

Pure view — receives `section: SectionDerivedFields` (computed fields from `useSectionsList` in the parent). No fetching inside. No split needed.

```
src/components/FlowsThumb.tsx
src/components/FlowsThumb.stories.tsx
```

Stories: no data (null flows), numeric flow, within range, above, below.

### 7.2.3 — `SimpleStarRating`

**Source:** `apps/mobile/src/components/SimpleStarRating.tsx`

Pure view — receives `value: number | null` (0–5). No split needed.

```
src/components/SimpleStarRating.tsx
src/components/SimpleStarRating.stories.tsx
```

Stories: 0, 1, 2.5, 5, null.

### 7.2.4 — `UnverifiedBadge`

Pure view — small icon badge for sections that haven't been verified. No split needed.

```
src/components/UnverifiedBadge.tsx
```

No story needed (trivial icon).

### 7.2.5 — `Chips`, `TernaryChips`

**Source:** `apps/mobile/src/components/Chips.tsx`

Pure view — renders a row of selectable chip buttons. No fetching. `TernaryChips` extends with tri-state selection (on / off / both). No split needed.

```
src/components/Chips.tsx
src/components/Chips.stories.tsx
```

Stories: empty, single chip, multi-chip, selected state, ternary states.

### 7.2.6 — `NavigateButton`

**Source:** `apps/mobile/src/components/NavigateButton.tsx`

Contains `Linking.openURL()` for navigation apps — this is a side effect, not data fetching. No split needed (the side effect is triggered by user press, not on mount).

```
src/components/NavigateButton.tsx
src/components/NavigateButton.stories.tsx
```

Stories: with put-in coords, with take-out coords, disabled (null coords). Use `action()` handler in story to mock `Linking.openURL`.

**Note on Reanimated usage:** `NavigateButton` in the old app receives a `scaleValue: SharedValue<number>` for animated scale as the swipe underlay reveals. This is a pure animation prop — no state.

### 7.2.7 — `LicenseBadge`, `LicenseLogo`

Pure view. No split needed.

```
src/components/LicenseBadge.tsx
src/components/LicenseLogo.tsx
src/components/LicenseBadge.stories.tsx
```

Stories: different license types (CC, commercial, public domain).

### 7.2.8 — `Markdown`

**Source:** `apps/mobile/src/components/Markdown.tsx`

Thin wrapper around `EnrichedMarkdownText` from `react-native-enriched-markdown`. Pure view. No split needed.

```tsx
// src/components/Markdown.tsx
import { EnrichedMarkdownText } from 'react-native-enriched-markdown';
import type { PropsWithChildren } from 'react';

function Markdown({ children }: PropsWithChildren) {
  return <EnrichedMarkdownText>{children ?? ''}</EnrichedMarkdownText>;
}
```

```
src/components/Markdown.tsx
src/components/Markdown.stories.tsx
```

Stories: plain text, headers, bold/italic, links, lists, code block, empty string.

### 7.2.9 — `Collapsible`

Pure view — animated expand/collapse container. Uses Reanimated `useAnimatedStyle` + `withTiming` for height animation. No split needed.

```
src/components/Collapsible.tsx
src/components/Collapsible.stories.tsx
```

Stories: collapsed (default), expanded, long content.

### 7.2.10 — `SectionListItemView` + `SectionListItem`

**Source:** `apps/mobile/src/screens/region/sections-list/item/`

**Split:**

- `SectionListItemView` — pure view. Renders `DifficultyThumb`, river/section name, `SimpleStarRating`, `UnverifiedBadge`, `FlowsThumb`. Receives all data as props. No navigation, no hooks.
- `SectionListItem` — container. Wraps `SectionListItemView` in `ReanimatedSwipeable`. Renders `SectionUnderlay` (FavoriteButton + 2 NavigateButtons) as right actions. Connects `onPress` to navigate to section screen.

```
src/screens/region/sections-list/item/
  SectionListItemView.tsx       ← dumb
  SectionListItemView.stories.tsx
  SectionListItem.tsx           ← container (swipeable + navigation)
  SectionListItem.stories.tsx   ← swipeable interaction story
  SectionUnderlay.tsx           ← underlay buttons
  constants.ts
```

**Storybook story for `SectionListItemView`:** wrap in a fixed-height container matching `ITEM_HEIGHT`. Show: normal section, unverified section, no flow data, high star rating.

**Storybook story for `SectionListItem`:** wrap in `GestureHandlerRootView` (required for `ReanimatedSwipeable` to work in Storybook). Use mock `onPress` and mock navigation context. Stories:

- Default: item at rest
- SwipedOpen: call `swipeRef.current?.openRight()` in a `useEffect` with a short delay so the story starts visually swiped — lets you inspect `SectionUnderlay` layout and button tap areas
- Use `SwipeableListProvider` with a mock ref so only-one-open coordination is exercisable interactively

The `SectionListItem` story is the primary visual test for swipe UX (underlay layout, button sizes, snap behavior) before the full list is wired up.

---

## 7.3 — Navigation wiring + providers (dummy screens)

Wire the full navigation structure first, with placeholder screens for content not yet built. This gives a runnable app for all subsequent steps.

### RegionStack

```tsx
// RegionStack (native stack)
<Stack.Screen name={Screens.REGION} component={RegionScreen} />
<Stack.Screen name={Screens.FILTER} component={FilterScreen} />
```

`FilterScreen` uses the default `presentation: 'card'` (standard push). No sheet presentation — it has scrollable content.

### RegionScreen + RegionTitle

`RegionScreen` renders `RegionTabsScreen` as its child. The stack header shows `RegionTitle` — truncated region name from route params (falls back to empty until data loads in 7.4).

### RegionTabs (Paper BottomNavigation)

**Source:** `apps/mobile/src/screens/region/RegionTabs.tsx`

The old app uses `@react-navigation/material-bottom-tabs` (dropped in nav v7). Replace with react-native-paper's `BottomNavigation` integrated with react-navigation:

```tsx
import { BottomNavigation } from 'react-native-paper';
import {
  CommonActions,
  useNavigationBuilder,
  TabRouter,
  createNavigatorFactory,
} from '@react-navigation/native';
```

Tabs: Map, Sections, Info (3 tabs; Chat tab deferred to Phase 12). At this step, each tab renders a `<View><Text>Coming soon</Text></View>` placeholder.

### Providers

Wire all context providers around the region screen tree at this step so subsequent steps can consume them without structural changes:

```tsx
<BottomSheetModalProvider>
  <MapSelectionProvider>
    {' '}
    {/* manages map selection state + BottomSheetModal ref */}
    <RegionsFilterProvider>
      {' '}
      {/* filter state (difficulty, season, duration) */}
      <SwipeableListProvider>
        {' '}
        {/* only-one-open swipeable coordination */}
        <RegionTabs />
      </SwipeableListProvider>
    </RegionsFilterProvider>
    {hasData && <RegionFAB />}
    <SectionsProgress />
  </MapSelectionProvider>
</BottomSheetModalProvider>
```

`MapSelectionProvider`, `RegionsFilterProvider`, and `SwipeableListProvider` can be empty shells at this step — they just need to exist so consumers don't crash.

**After this step:** app navigates to region, shows 3 placeholder tabs, no crashes.

---

## 7.4 — GraphQL + data shell

Wire real data into the navigation skeleton from 7.3.

### RegionTabsScreen

Port `RegionTabsScreen.tsx`. Calls `useRegionQuery` from `@whitewater-guide/clients`. Wraps with `WithQueryError` for error state. On success, passes region to context and updates header title via `navigation.setOptions({ title: region.name })`.

### useSectionsList

Call `useSectionsList` from `@whitewater-guide/clients` inside the sections tab screen. The hook loads sections progressively (pagination) and exposes `status`, `sections`, `count`, `refresh`.

### SectionsProgress

Port `SectionsProgress` — shows loading state (progress bar or spinner) while sections paginate in. Renders as `ListHeaderComponent` in the FlashList (7.5) and as an overlay in the map tab (7.7).

### GraphQL notes

No new `.gql` files needed — both `useRegionQuery` and `useSectionsList` are already exported from `@whitewater-guide/clients`.

**After this step:** region name appears in header; loading and error states are visible; section count is available.

---

## 7.5 — Sections list

Build the full sections list tab. Prerequisites: shared components from 7.2.1–7.2.6, 7.2.10.

### FlashList migration from BigList

Old app uses `react-native-big-list` (replaced by `@shopify/flash-list`). Sections list has homogeneous item height (`ITEM_HEIGHT`), making the migration straightforward:

```tsx
<FlashList
  data={sections}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
  estimatedItemSize={ITEM_HEIGHT}
  overrideItemLayout={(layout) => {
    layout.size = ITEM_HEIGHT;
  }}
  getItemType={() => 'section'}
  contentContainerStyle={{ paddingBottom: tabBarHeight }}
  ListHeaderComponent={<SectionsProgress />}
  ListEmptyComponent={<NoSectionsPlaceholder />}
/>
```

### Swipeable items with ReanimatedSwipeable

Replace the custom `Swipeable` component (uses deprecated `PanGestureHandler` + `useAnimatedGestureHandler`) with `ReanimatedSwipeable`:

```tsx
import { ReanimatedSwipeable } from 'react-native-gesture-handler/ReanimatedSwipeable';

const SectionListItem = ({ item, onPress }: SectionListItemProps) => {
  const swipeRef = useRef<ReanimatedSwipeable>(null);
  const { activeRef } = useSwipeableList();

  // Reset on FlashList recycle
  useEffect(() => {
    swipeRef.current?.close();
  }, [item.id]);

  const renderRightActions = useCallback(
    (_progress: SharedValue<number>, drag: SharedValue<number>) => (
      <SectionUnderlay section={item} position={drag} />
    ),
    [item],
  );

  return (
    <ReanimatedSwipeable
      ref={swipeRef}
      renderRightActions={renderRightActions}
      rightThreshold={NAVIGATE_BUTTON_WIDTH}
      friction={2}
      overshootRight={false}
      onSwipeableWillOpen={() => {
        if (activeRef.current && activeRef.current !== swipeRef.current) {
          activeRef.current.close();
        }
        activeRef.current = swipeRef.current;
      }}
      onSwipeableClose={() => {
        if (activeRef.current === swipeRef.current) {
          activeRef.current = null;
        }
      }}
    >
      <SectionListItemView section={item} onPress={onPress} />
    </ReanimatedSwipeable>
  );
};
```

**Recycling warning:** The `useEffect` above resets swipe state when `item.id` changes. Without this, a recycled view might appear partially swiped for a different item.

**Performance warning:** Keep `renderRightActions` memoized with `useCallback` to avoid re-renders.

### FavoriteButton

Port from old app. Used inside `SectionUnderlay`. Reads/writes favorites state via context or AsyncStorage.

**After this step:** sections list scrolls, swipe reveals underlay buttons, tapping a section navigates to the section screen.

---

## 7.6 — Search + filter

Extend the sections list screen with search and filtering.

### Search bar

Wire `headerSearchBar` to the sections list screen (see architectural decision above). Filter `sections` client-side by `river.name + ' ' + name` against the query string.

### FilterButton

Render `FilterButton` in `headerRight`. FilterButton navigates to `Screens.FILTER` via standard stack push. Shows a filled icon when any filter is active (reads from `RegionsFilterProvider`). Dismisses any open `BottomSheetModal` before navigating.

### FilterScreen

Port from old app. Scrollable screen with difficulty range picker, season chips, and duration chips.

Uses:

- `Chips`, `TernaryChips` (7.2.5) — difficulty/season/duration chip rows
- `Collapsible` (7.2.9) — collapsible filter sections

### RegionsFilterProvider

Port from `@whitewater-guide/clients` usage. Filter state (difficulty, season, duration) lives here. `useSectionsList` consumes filter state to filter results.

**After this step:** search bar filters sections by name; filter sheet shows filter options; active filters are reflected in the sections list.

---

## 7.7 — Map components

Build the map tab. Stories in this step replace `src/storybook/smoke-tests/MapView/MapView.stories.tsx` (delete it).

### 7.7.1 — `useAppState` + `useCamera` + `CameraProvider`

- Port custom `useAppState` hook (see architectural decision above).
- Port `apps/mobile/src/components/map/hooks/useCamera.tsx` directly. Context-based ref pattern is correct for rnmapbox v10.

```
src/hooks/useAppState.ts
src/components/map/hooks/useCamera.tsx
```

### 7.7.2 — `BaseMap`

**Source:** `apps/mobile/src/components/map/BaseMap.tsx`

Port with changes:

1. Replace `useAppState` from `@react-native-community/hooks` with the custom hook.
2. Replace `UserLocation` with `LocationPuck`.
3. Remove deprecated `Camera` props: `followUserMode`, `followUserLocation`. Keep `allowUpdates={appState === 'active'}`.
4. Keep `localizeLabels`, `pitchEnabled={false}`, `rotateEnabled={false}`, `scaleBarEnabled={false}`, `compassEnabled={false}`.

```
src/components/map/BaseMap.tsx
src/components/map/BaseMap.stories.tsx
```

**Story:** `GestureHandlerRootView` + `CameraProvider` wrapper. Renders `BaseMap` centered on a fixed coordinate. Verifies the map loads, tiles render, and location puck is present. This is the canonical replacement for the `MapView` smoke test — delete `src/storybook/smoke-tests/MapView/MapView.stories.tsx` once this story exists.

### 7.7.3 — `FeaturesMap`

**Source:** `apps/mobile/src/components/map/FeaturesMap.tsx`

Port with no API changes. `ShapeSource`, `LineLayer`, `CircleLayer`, `SymbolLayer`, expression filters — all stable in v10.3.

```
src/components/map/FeaturesMap.tsx
src/components/map/FeaturesMap.stories.tsx
src/components/map/hooks/useMapboxData.ts
src/components/map/hooks/useMapboxSelectionFilter.ts
src/components/map/hooks/useBoundsRef.ts
src/components/map/hooks/useSelectionHandler.ts
src/components/map/layers.ts
```

**Story:** renders `FeaturesMap` with fixture GeoJSON (a few sections as LineStrings, a POI as a Point). Tap on a section feature — verify `onPress` fires (use `action()`). Shows section lines, POI circles, and selection highlight.

### 7.7.4 — `CameraControls`, `LayersSelector`

Port from `apps/mobile/src/components/map/`. `CameraControls` calls `camera.setCamera(...)` via `useCamera()` — compatible with v10.3. `LayersSelector` is pure UI + app settings.

```
src/components/map/CameraControls.tsx
src/components/map/LayersSelector.tsx
```

### 7.7.5 — Map hooks

```
src/components/map/hooks/useMapboxBounds.ts   (port as-is)
src/components/map/hooks/useInRegionLocation.ts  (port — uses turf packages now installed)
```

### 7.7.6 — Map selection panels (bottom sheets)

**Source:** `apps/mobile/src/components/map/panels/`

Use `@gorhom/bottom-sheet` v5's `BottomSheetModal`. API changes from v4 → v5:

- `BottomSheetModal` API is mostly stable.
- `backdropComponent` still works the same way.
- Replace `RectButton` from RNGH (deprecated old API) with `Pressable` from `react-native`.

```
src/components/map/panels/
  SelectedElementSheet.tsx
  SelectedSectionSheet.tsx
  SelectedSectionHeader.tsx
  SelectedSectionButtons.tsx
  SelectedSectionTable.tsx
  SectionDetailsButton.tsx
  SectionFlowsRow.tsx
  SelectedPOISheet.tsx
  SelectedPOIHeader.tsx
  SelectedPOIButtons.tsx
  Backdrop.tsx
  SelectedSectionSheet.stories.tsx
  SelectedPOISheet.stories.tsx
```

**Stories for `SelectedSectionSheet` and `SelectedPOISheet`:** wrap in `GestureHandlerRootView` + `BottomSheetModalProvider`. Call `present()` in a `useEffect` so the sheet opens immediately in the story. Show: closed state, open at first snap point, open at expanded snap point (via `snapToIndex`). Use fixture section/POI data. This lets you verify sheet layout, snap behavior, button layout, and content without running the full map flow.

### 7.7.7 — `RegionFAB`

Port from old app. Renders over the tab navigator. Shows location-center button; uses `useInRegionLocation` to decide whether to show.

### 7.7.8 — Wire map tab

Replace the placeholder map tab screen with the real `RegionMapScreen`:

- `CameraProvider` wraps `BaseMap` + `FeaturesMap` + `CameraControls` + `LayersSelector`
- `MapSelectionProvider` handles selection state and presents `SelectedSectionSheet` / `SelectedPOISheet`

**After this step:** map tab renders with section overlays; tapping a section opens the bottom sheet; LayersSelector switches map style; location button centers camera.

---

## 7.8 — Region info

**Source:** `apps/mobile/src/screens/region/info/`

Prerequisites: `Markdown` (7.2.8), `LicenseBadge` / `LicenseLogo` (7.2.7).

`RegionInfoView` reads `region.description` from `useRegion()` context and renders it with `<Markdown>`. Port directly — the only change is the `Markdown` component is now backed by `react-native-enriched-markdown`.

`RegionLicense` reads license info from the region and renders `LicenseBadge` + `LicenseLogo`.

```
src/screens/region/info/
  RegionInfoScreen.tsx
  RegionInfoView.tsx
  RegionLicense.tsx
  NoRegionDescription.tsx
```

Replace the placeholder info tab screen with the real `RegionInfoScreen`.

**After this step:** info tab shows region description as rendered markdown and displays license badge/logo.

---

## 7.9 — Validation

### Per-step checkpoints

**After 7.3:**

- [ ] Navigate to region → see 3 placeholder tabs
- [ ] No crashes when switching tabs

**After 7.4:**

- [ ] Region name appears in navigation header
- [ ] Loading state visible while sections paginate
- [ ] Error state visible when network fails

**After 7.5:**

- [ ] Sections list displays with difficulty, name, stars, flow indicators
- [ ] Swipe left reveals FavoriteButton + put-in + take-out NavigateButtons
- [ ] Only one swipeable open at a time
- [ ] Swipeable resets correctly on fast scroll (recycling)
- [ ] Tap section item navigates to section screen

**After 7.6:**

- [ ] Search bar filters sections by river/section name
- [ ] Filter button opens FilterScreen
- [ ] Filter chips update section list
- [ ] Active filter state reflected in FilterButton icon

**After 7.7:**

- [ ] Map renders with section lines and POIs
- [ ] Tapping a section opens `SelectedSectionSheet`
- [ ] `SelectedSectionSheet` snaps between two detents; header tap expands
- [ ] `SelectedPOISheet` opens on POI tap
- [ ] Camera centers on user location if inside region bounds
- [ ] LayersSelector switches map style

**After 7.8:**

- [ ] Region info tab renders markdown description
- [ ] License badge and logo display correctly
- [ ] Empty description shows `NoRegionDescription` placeholder

### Final validation

- [ ] **Storybook:** All stories in 7.2 and 7.7 verified visually
- [ ] `src/storybook/smoke-tests/MapView/MapView.stories.tsx` deleted (replaced by `BaseMap.stories.tsx`)
- [ ] **Unit tests:** `useInRegionLocation`, filter utilities
- [ ] **Detox E2E:** Navigate to region → switch tabs → select section on map → swipe section item → open filter → search sections
