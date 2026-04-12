# Phase 8: Section Detail (map + chart + info + media)

**Goal:** Complete section viewing experience — four-tab detail screen (Map, Chart, Info, Media) with section map, interactive flow/gauge chart, section info with collapsible table, and photo/video/blog gallery with pinch-to-zoom.

---

## Architectural decisions

### Victory-native v41: incompatible API, build directly

`@whitewater-guide/clients`'s `createChartView` factory was written for **victory-native v36** — it imports from `victory-chart` and `victory-core` and uses `VictoryChart`, `VictoryAxis`, `VictoryLine`, etc. Victory-native **v41** (already installed) is a complete rewrite: Skia-based, different component API (`CartesianChart` / `Line` from `victory-native`), different zoom/tooltip model.

**Decision:** Do **not** use `createChartView` from clients. Instead:

1. Use `ChartProvider` and `useChart()` from clients — they deal with data fetching, filter state, and unit state, which are API-independent.
2. Build a new `ChartComponent` directly with the v41 API (`CartesianChart` from `victory-native`).
3. The `Crosshair` (tooltip), `TimeGrid`, `HorizontalGrid` and label components all need to be re-implemented to match v41's rendering model (Skia paint callbacks rather than React elements injected into Victory axes).

### Custom photo gallery (gesture-handler + reanimated v4)

`react-native-awesome-gallery` is incompatible with reanimated v4. The old app used `react-native-image-zoom-viewer`. Both are dropped. Implement `PhotoGallery` using:

- `react-native-gesture-handler` `Gesture.Pinch()` + `Gesture.Pan()` for zoom/pan
- `react-native-reanimated` v4 `useSharedValue` / `useAnimatedStyle` for transforms
- `react-native-reanimated` `FlatList` (or `ScrollView`) for horizontal swipe between photos

The component is built in Storybook first and integrated into the media tab as the last step of this phase.

### Providers and queries (from `@whitewater-guide/clients`)

All four context providers used in this phase live in `packages/clients` and are re-exported from `@whitewater-guide/clients`.

| Provider | GraphQL query | Variables | Hook(s) |
|----------|--------------|-----------|---------|
| `SectionProvider` | `sectionDetails` | `$sectionId`, `$withMedia: Boolean!`, `$thumbSize: Int` | `useSection()` → `SafeSectionDetails \| null \| undefined`; `useSectionQuery()` → full `QueryResult` with `refetch` |
| `RegionProvider` | `regionDetails` | `$regionId`, `$bannerWidth: Int` | `useRegion()`; `useRegionQuery()` |
| `MapSelectionProvider` | none (React state only) | — | `useMapSelection()` → `[selection, onSelected]` |
| `ChartProvider` | `measurements` | `$gaugeId`, `$sectionId`, `$filter` (`MeasurementsFilter`) | `useChart()` — see below |

**`sectionDetails`** fetches section core info, shape, POIs, tags, gauge (`flowUnit`, `levelUnit`, `latestMeasurement`), flow/level bindings, license, and — when `withMedia: true` — all media nodes with thumbnail URLs at `thumbSize × thumbSize`. `SectionProvider` is called with `thumbSize={PHOTO_SIZE_PX}` so media is included in the initial load; no separate media query is needed.

**`regionDetails`** fetches region core info, POIs, bounds, banners (scaled to `bannerWidth`), description, and license. Pass `bannerWidth={theme.screenWidthPx}` from `SectionScreenInternal`.

**`useChart()`** returns:
```ts
{
  gauge: GaugeForChartFragment;
  section?: Node & SectionFlowsFragment;
  filter: MeasurementsFilter;           // default: last 1 day
  onChangeFilter: (v: MeasurementsFilter) => void;
  unit: Unit;                           // FLOW or LEVEL
  unitChangeable: boolean;              // true when gauge has both units
  onChangeUnit: (u: Unit) => void;
  measurements: {
    data: ChartDataPoint[];             // raw values transformed by useFormulas()
    loading: boolean;
    error?: ApolloError;
    refresh: () => Promise<void>;
  };
}
```

Measurements are fetched with `fetchPolicy: 'no-cache'` (always fresh) and transformed by **`useFormulas(section)`** — a `clients` helper that applies each binding's formula string (parsed by `expr-eval`) to convert raw flow/level values before rendering.

### Tab footer: PaperTabBar (already in place)

`SectionTabs` already uses `createBottomTabNavigator` with `PaperTabBar` as the `tabBar` prop. This renders `BottomNavigation.Bar` from react-native-paper (shifting mode, primary-colored background). **No changes needed to PaperTabBar.**

### Header mutated per tab via `getParent().setOptions()`

The section screen lives inside `RootStack` (native stack), which owns the header bar. Each tab screen updates the parent stack's `headerRight` when focused using `useFocusEffect` + `navigation.getParent()?.setOptions()`. This is the same pattern as old mobile.

---

## 8.1 — Dependency review

All required dependencies for this phase are **already installed** in `package.json`. No `pnpm add` needed.

| Package | Status | Used for |
|---------|--------|----------|
| `victory-native` | ✅ `^41.20.2` | Chart rendering (Skia-based v41) |
| `@shopify/react-native-skia` | ✅ `^2.6.2` | Required peer dep of victory-native v41 |
| `react-native-worklets` | ✅ `^0.8.1` | Required peer dep of victory-native v41 |
| `react-native-gesture-handler` | ✅ `^2.31.1` | Pinch/pan gestures for photo gallery |
| `react-native-reanimated` | ✅ `^4.3.0` | Animations for photo gallery + chart transitions |
| `@react-native-clipboard/clipboard` | ✅ `^1.16.3` | Copy coordinates in section info |
| `react-native-webview` | ✅ `^13.16.1` | Video items (blog/video embeds) |
| `@react-native-community/netinfo` | ✅ `^12.0.1` | Offline detection in chart screen |
| `@rnmapbox/maps` | ✅ `^10.3.0` | Section map tab |

---

## 8.2 — Chart components + Storybook

Build chart components **bottom-up** — innermost primitives first, then containers. Verify each in Storybook before proceeding. The goal of this step is a fully working `ChartLayout` that can be dropped into the chart tab screen.

**Source directory:** `apps/mobile/src/components/chart/`

### 8.2.1 — `VictoryTheme` and `NoChart`

`VictoryTheme` is a style config object passed to `CartesianChart`. Port the color palette (line color, axis color, grid color) from the old theme. `NoChart` renders a placeholder for three states: no gauge, no data, offline.

```
src/components/chart/VictoryTheme.ts
src/components/chart/NoChart.tsx
src/components/chart/NoChart.stories.tsx
```

**`NoChart` stories:** reason="noGauge", reason="noData", reason="offline".

### 8.2.2 — `TimeGrid` and `TimeLabel`

In victory-native v41, custom grid and label rendering is done via **render props / callback props** on the axes of `CartesianChart`. These components receive pixel coordinates and render primitives (Text, Line) using Skia or React Native — consult the v41 API to confirm the exact prop shape.

Port the visual output (day separator lines, date labels below the x-axis) to match the old app's appearance.

```
src/components/chart/TimeGrid.tsx
src/components/chart/TimeLabel.tsx
```

No standalone stories needed — tested as part of `ChartComponent.stories.tsx` (8.2.5).

### 8.2.3 — `HorizontalGrid`, `HorizontalTick`, `HorizontalLabel`

Horizontal grid lines and y-axis labels, colored by flow binding (in-range green / out-of-range red / default gray). Port the color logic from `@whitewater-guide/clients`'s `HorizontalTick` / `HorizontalLabel` wrappers.

```
src/components/chart/HorizontalGrid.tsx
src/components/chart/HorizontalTick.tsx
src/components/chart/HorizontalLabel.tsx
```

No standalone stories — tested via `ChartComponent.stories.tsx`.

### 8.2.4 — `Crosshair` (interactive tooltip)

The crosshair shows the value and timestamp when the user touches the chart line. In v41, `CartesianChart` provides a `renderOutside` or tooltip prop pattern.

Port the tooltip content: formatted value with unit, formatted date/time, gauge name. The exact API for rendering the crosshair must be checked against v41 docs — `victory-native` v41 uses a `ChartPressState` / `useChartPressState` hook for tracking the press position.

```
src/components/chart/Crosshair.tsx
src/components/chart/Crosshair.stories.tsx
```

**`Crosshair` story:** render with a mock press state at a fixed position, show value + timestamp label.

### 8.2.5 — `ChartComponent`

The core chart. **Do not use `createChartView`** — build directly with v41 API:

```tsx
import { CartesianChart, Line, useChartPressState } from 'victory-native';

// ChartComponent receives the same ChartViewProps interface as the old app,
// but renders via CartesianChart instead of VictoryChart.
```

Responsibilities:
- Accepts `data`, `unit`, `gauge`, `section`, `filter`, `width`, `height` props (same shape as old `ChartViewProps`)
- Renders time x-axis with `TimeGrid` and `TimeLabel` callbacks
- Renders flow y-axis with `HorizontalGrid`, `HorizontalTick`, `HorizontalLabel` callbacks
- Renders `Line` for the measurement data
- Renders `Crosshair` for interactive touch feedback via `useChartPressState`
- Applies `VictoryTheme` color palette

```
src/components/chart/ChartComponent.tsx
src/components/chart/ChartComponent.stories.tsx
```

**`ChartComponent` stories:** renders with fixture measurement data (array of `{ timestamp, flow, level }` objects). Story variants: flow unit, level unit, no data (shows `NoChart`), loading state.

### 8.2.6 — `ChartFlowToggle` and `ChartFlowToggleUnit`

Toggle between flow and level units. Reads `unit`, `onChangeUnit`, `unitChangeable` from `useChart()`. Only renders when both flow and level units are available for the gauge.

```
src/components/chart/ChartFlowToggle.tsx
src/components/chart/ChartFlowToggleUnit.tsx
src/components/chart/ChartFlowToggle.stories.tsx
```

**Stories:** flow active, level active, single-unit gauge (toggle hidden).

### 8.2.7 — `ChartPeriodToggle`

Toggle between time period presets (1 day, 3 days, 7 days, 1 month). Reads `filter`, `onChangeFilter` from `useChart()`.

```
src/components/chart/ChartPeriodToggle.tsx
src/components/chart/ChartPeriodToggle.stories.tsx
```

**Stories:** each period selected.

### 8.2.8 — `GaugeInfo`

Displays gauge name, last update time, and current values (flow + level if available). Pure view driven by `gauge` and `measurements.data` from `useChart()`.

```
src/components/chart/GaugeInfo.tsx
src/components/chart/GaugeInfo.stories.tsx
```

**Stories:** gauge with both units, flow-only gauge, level-only gauge, no data.

### 8.2.9 — `Chart` (stateful container)

Wraps `ChartComponent` with `onLayout` measurement. Handles pull-to-refresh by forwarding a `refresh()` imperative ref that delegates to `useChart().measurements.refresh()`. Calls `useAppState()` (the custom hook from Phase 7) to auto-refresh when the app resumes from background.

```
src/components/chart/Chart.tsx
```

`Chart` uses `forwardRef<ChartStatic>` to expose `{ refresh: () => Promise<void> }`.

```ts
export interface ChartStatic {
  refresh: () => Promise<void>;
}
```

No Storybook story — tested as part of `ChartLayout`.

### 8.2.10 — `ChartLayout`

The entry point for the chart tab. Wraps everything with `ChartProvider` (which fires the `measurements` query) and then composes `Chart` + `ChartPeriodToggle` + `GaugeInfo` + `ChartFlowToggle`. The layout has two zones:

- **Chart area** (`flex: 1`): `Chart` + a transparent overlay `ScrollView` for pull-to-refresh
- **Controls area** (fixed height `4 * rowHeight`): `ChartPeriodToggle` → `GaugeInfo` → `ChartFlowToggle` — collapses to zero height when `collapsed={true}`

`ChartLayout` receives `section` and `gauge` as props and passes them to `ChartProvider`. All chart child components access data via `useChart()`.

```
src/components/chart/ChartLayout.tsx
src/components/chart/ChartLayout.stories.tsx
```

**`ChartLayout` story:** wraps in a mock `ChartProvider` (or stubs `useChart` return value via decorator). Shows the full layout at normal size and collapsed state. This is the smoke test for the full chart before it's wired into the screen.

**After this step:** `ChartLayout` renders correctly in Storybook with fixture data. The chart displays measurement data, axes, crosshair, and controls. Pull-to-refresh visible.

---

## 8.3 — Navigation structure

### 8.3.1 — Navigator tree

The section detail screen lives in `RootStack` as `SECTION_SCREEN`. The navigation tree is:

```
RootStack (NativeStack)
└── SECTION_SCREEN → SectionScreen
    │
    ├── Header bar (owned by RootStack — innerScreenOptions)
    │   ├── Background: theme.colors.primary
    │   ├── Title: SectionTitle (river · section name, adaptive font size)
    │   │   → Set via navigation.setOptions() when section data loads
    │   └── headerRight: per-tab (see §Header behavior below)
    │
    └── SectionTabs (bottom tab navigator)
        │
        ├── Tab footer: PaperTabBar (always visible)
        │   ├── Background: theme.colors.primary
        │   ├── Mode: shifting (active tab highlights, inactive tabs collapse)
        │   ├── Active icon color: theme.colors.textLight (white)
        │   ├── Inactive icon color: theme.colors.primaryLighter
        │   └── keyboardHidesNavigationBar: false
        │
        ├── SECTION_MAP   → SectionMapScreen
        ├── SECTION_CHART → SectionChartScreen  (hidden if section has no gauge)
        ├── SECTION_INFO  → SectionInfoScreen   (default initial tab)
        └── SECTION_MEDIA → SectionMediaScreen
        │
        └── SectionFAB (absolutely positioned over PaperTabBar — always rendered)
```

### 8.3.2 — `SectionScreen` (provider wrapper)

**This component does not yet exist in mobile2.** Create it and update `RootStack` to use it instead of `SectionTabs` directly.

`SectionScreen` wraps the section tab navigator with all required context providers. The wrapping order mirrors the old app:

```tsx
// src/screens/section/SectionScreen.tsx

function SectionScreen({ route }) {
  const { sectionId } = route.params;
  // thumbSize = PHOTO_SIZE_PX triggers sectionDetails withMedia:true — no separate media query needed
  return (
    <SectionProvider sectionId={sectionId} thumbSize={PHOTO_SIZE_PX}>
      <SectionScreenInternal />
    </SectionProvider>
  );
}

function SectionScreenInternal() {
  const section = useSection();
  const regionId = section?.region?.id;
  return (
    // bannerWidth scales banner image URLs in the regionDetails query
    <RegionProvider regionId={regionId} bannerWidth={theme.screenWidthPx} fetchPolicy="cache-first">
      <MapSelectionProvider>
        <SectionTabs />
      </MapSelectionProvider>
    </RegionProvider>
  );
}
```

Update `RootStack`:

```tsx
// Before (Phase 4 placeholder):
<Stack.Screen
  name={Screens.SECTION_SCREEN}
  component={SectionTabs}
  options={{ ...innerScreenOptions, headerTitle: 'Section' }}
/>

// After:
<Stack.Screen
  name={Screens.SECTION_SCREEN}
  component={SectionScreen}
  options={{ ...innerScreenOptions }}  // headerTitle set dynamically
/>
```

### 8.3.3 — `SectionTabs` — tab registration

`SectionTabs` wires the four tabs with `PaperTabBar`. The **chart tab is conditionally registered**: if `section?.gauge` is falsy, `SECTION_CHART` is omitted from the navigator.

```tsx
function SectionTabs() {
  const { t } = useTranslation();
  const section = useSection();

  // Set section name in parent (RootStack) header when data loads
  const navigation = useNavigation();
  useEffect(() => {
    if (section) {
      navigation.setOptions({ headerTitle: () => <SectionTitle section={section} /> });
    }
  }, [navigation, section]);

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        backBehavior="none"
        initialRouteName={Screens.SECTION_INFO}
        tabBar={(props) => <PaperTabBar {...props} />}
      >
        <Tab.Screen name={Screens.SECTION_MAP} component={SectionMapScreen} ... />
        {!!section?.gauge && (
          <Tab.Screen name={Screens.SECTION_CHART} component={SectionChartScreen} ... />
        )}
        <Tab.Screen name={Screens.SECTION_INFO} component={SectionInfoScreen} ... />
        <Tab.Screen name={Screens.SECTION_MEDIA} component={SectionMediaScreen} ... />
      </Tab.Navigator>
      <SectionFAB />
    </View>
  );
}
```

### 8.3.4 — Header behavior per tab

Each tab screen uses `useFocusEffect` to update the **parent stack's** `headerRight` when it becomes active. This works because `SectionTabs` is inside `RootStack`, so `navigation.getParent()` returns the RootStack navigator.

| Tab | `headerTitle` | `headerRight` | Notes |
|-----|--------------|---------------|-------|
| `SECTION_MAP` | `<SectionTitle>` (set in SectionTabs) | `null` | No button |
| `SECTION_CHART` | same | Collapse/expand icon button | Only shown when `gauge` exists; icon toggles between `arrow-collapse-all` / `arrow-expand-all` |
| `SECTION_INFO` | same | `<SectionInfoMenu>` | 3-dot menu: Share, Edit (auth-gated), Suggest (auth-gated) |
| `SECTION_MEDIA` | same | `null` | No button |

Pattern used in each tab screen:

```tsx
useFocusEffect(
  useCallback(() => {
    navigation.getParent()?.setOptions({
      headerRight: () => <TabSpecificButton />,
    });
  }, [navigation, /* relevant deps */]),
);
```

### 8.3.5 — `SectionFAB` positioning

`SectionFAB` is rendered **after** `Tab.Navigator` inside `SectionTabs`, absolutely positioned above the tab bar:

```tsx
const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: theme.margin.double,
    bottom: theme.margin.double + theme.materialBottomBarHeight + (Platform.OS === 'ios' ? 16 : 0),
  },
});
```

The FAB is always rendered (not per-tab). It shows two actions: Add Descent and Add Suggestion — both auth-gated (unauthenticated users are navigated to AUTH_MAIN).

### 8.3.6 — `SectionTitle`

Custom header title component. Renders `sectionName(section)` (river · section format from clients) with adaptive font size — longer names use a smaller font size to avoid truncation. Port `getTitleFontSize` utility from old app.

```
src/screens/section/SectionTitle.tsx
src/utils/getTitleFontSize.ts
```

**After this step:** navigating to a section shows the four-tab (or three-tab, no gauge) layout. PaperTabBar visible. Section name appears in header when data loads. SectionFAB visible. All tabs render placeholder screens (replaced in subsequent steps).

---

## 8.4 — Map tab (`SectionMapScreen`)

**Source:** `apps/mobile/src/screens/section/map/SectionMapScreen.tsx`

Port directly. Uses `BaseMap` / `FeaturesMap` and `MapSelectionProvider` (all built in Phase 7). Section-specific additions:

- `getSectionContentBounds(section)` — compute initial camera bounds from section shape
- POIs: section's own POIs (`section.pois`) + gauge location synthesized from `section.gauge` and labeled "Gauge" — combined into one array and passed to `FeaturesMap`
- `FeaturesMap` renders the section in `detailed` mode (shows put-in/take-out markers + shape)
- `SelectedPOISheet` (Phase 7) floats over the map for POI tap feedback — reads selected POI via `useMapSelection()`
- `useMapSelection()` is the only hook from a context provider used here; section/POI data comes from `useSection()`

```
src/screens/section/map/SectionMapScreen.tsx
```

`headerRight` set to `null` on focus.

**After this step:** map tab renders the section shape with markers and POIs. Tapping a POI opens the POI bottom sheet.

---

## 8.5 — Info tab (`SectionInfoScreen`)

**Source:** `apps/mobile/src/screens/section/info/`

### 8.5.1 — `TextWithLinks`

Utility component — renders a string that may contain URLs as tappable links (opens via `Linking.openURL`). Used in `SectionInfoDescription` and other text blocks.

```
src/components/TextWithLinks.tsx
src/components/TextWithLinks.stories.tsx
```

**Stories:** plain text, single URL, multiple URLs, mixed text+URL.

### 8.5.2 — `CoordinatesInfo`

Displays put-in and take-out coordinates with a copy-to-clipboard button (uses `@react-native-clipboard/clipboard`). Pure view — receives coordinates as props.

```
src/screens/section/info/CoordinatesInfo.tsx
src/screens/section/info/CoordinatesInfo.stories.tsx
```

**Stories:** both coordinates, put-in only, none.

### 8.5.3 — `SectionInfoTable` + `SectionInfoMenu`

`SectionInfoTable` is a grid of labeled rows: difficulty, length, descent, duration, season, levels, flows, tags, river, etc. Collapsible — shows 3 rows by default, tapping "more" expands. Uses `Collapsible` from Phase 7.

`SectionInfoMenu` is the `headerRight` 3-dot menu for the info tab. Actions: share section link (via `Share` API), edit section (auth-gated, navigates to `ADD_SECTION_SCREEN`), suggest edit (auth-gated, navigates to `SUGGESTION`).

Replace `RectButton` from old app (deprecated RNGH API) with `Pressable`.

```
src/screens/section/info/SectionInfoTable.tsx
src/screens/section/info/SectionInfoMenu.tsx
```

### 8.5.4 — `SectionInfoDescription` and `HelpNeeded`

`SectionInfoDescription` renders `section.description` via `<Markdown>` (Phase 7 component). `HelpNeeded` is a banner shown when `section.helpNeeded` is true.

```
src/screens/section/info/SectionInfoDescription.tsx
src/screens/section/info/HelpNeeded.tsx
```

### 8.5.5 — `SectionInfoView` + `SectionInfoScreen`

`SectionInfoView` composes all info components in a `ScrollView` with pull-to-refresh. Layout:
1. `HelpNeeded` banner (conditional)
2. Section info caption
3. Collapsible `SectionInfoTable` (3 rows → expand)
4. Description caption
5. `SectionInfoDescription` (markdown)
6. `CoordinatesInfo`

`SectionInfoScreen` wraps `SectionInfoView`, wires `useFocusEffect` to set `headerRight = <SectionInfoMenu>`, and uses `SectionTabsScreen` for shared data-loading shell.

`SectionInfoView` calls **`useSectionQuery()`** (not just `useSection()`) so it can access `refetch` and `loading` for pull-to-refresh. `useSection()` is sufficient for read-only child components; the screen itself needs the full `QueryResult`.

```
src/screens/section/info/SectionInfoView.tsx
src/screens/section/info/SectionInfoScreen.tsx
src/screens/section/SectionTabsScreen.tsx
```

**`SectionTabsScreen`** — shared wrapper for all four tab screens. Wraps children in `WithQueryError` for both section and region queries (double-layer error handling, same as old app).

**After this step:** info tab shows section metadata, expandable details, markdown description, and coordinates. Info menu appears in header.

---

## 8.6 — Chart tab wired (`SectionChartScreen`)

**Source:** `apps/mobile/src/screens/section/chart/SectionChartScreen.tsx`

Port with one change: replace `useAppState` from `@react-native-community/hooks` (dropped) — `Chart.tsx` (8.2.9) already uses the custom `useAppState` hook from Phase 7.

Responsibilities:

- Reads `section?.gauge` — if no gauge, renders `<NoChart reason="noGauge" />`
- Tracks `collapsed` toggle state (boolean, default `false`)
- `useFocusEffect` sets `headerRight` to a `Pressable` with `arrow-collapse-all` / `arrow-expand-all` icon (only when gauge exists)
- `LayoutAnimation.configureNext(easeInEaseOut)` before toggling `collapsed` for smooth height transition
- Renders `<ChartLayout section={section} gauge={gauge} collapsed={collapsed} />`

```
src/screens/section/chart/SectionChartScreen.tsx
```

Wire into `SectionTabs` as `SECTION_CHART` screen.

Data flow reminder: `SectionChartScreen` reads `section` via `useSection()` and extracts `section.gauge`. It passes both to `ChartLayout`, which wraps them in `ChartProvider`. From that point all chart components use `useChart()` — no prop drilling beyond `ChartLayout`.

**After this step:** chart tab shows gauge data with interactive crosshair, period toggle, gauge info, and unit toggle. Collapse button in header shrinks the controls area.

---

## 8.7 — Media gallery: `PhotoGallery` (Storybook first, then integrated)

### 8.7.1 — `PhotoGallery` — Storybook story first

Build `PhotoGallery` as a standalone, self-contained component **before** integrating it into the media tab. Write the Storybook story first — it drives the API design.

`PhotoGallery` is a full-screen modal-style viewer that opens over the content when a photo is tapped. Accepts:
- `photos: MediaNode[]` — ordered list of photos
- `index: number` — initial photo index (-1 = closed)
- `onClose: () => void`
- `sectionLicense: LicenseFragment`

Implementation using gesture-handler + reanimated v4:

- **Swipe between photos:** `FlatList` (horizontal, `pagingEnabled`) with `reanimated.FlatList` wrapper for smooth scrolling, or a manual implementation with `PanGestureHandler` tracking horizontal drag
- **Pinch-to-zoom:** `Gesture.Pinch()` + `Gesture.Pan()` composed via `Gesture.Simultaneous()` using `GestureDetector`
- **Zoom state per photo:** `useSharedValue` for scale and translation; reset when swiping to a new photo
- **Double-tap to zoom:** `Gesture.Tap().numberOfTaps(2)` toggles between 1x and 2.5x
- **Close gesture:** swipe down when not zoomed closes the gallery via `onClose`
- **License display:** overlay at the bottom showing photo author/license

```
src/components/photo-gallery/PhotoGallery.tsx
src/components/photo-gallery/PhotoGalleryItem.tsx  ← single photo with zoom/pan
src/components/photo-gallery/PhotoGallery.stories.tsx
```

**`PhotoGallery` stories:**
- Single photo — verify zoom, pinch, double-tap
- Multiple photos — verify swipe navigation
- License overlay visible
- Gallery closed (index = -1) — renders nothing

Validate the gallery fully in Storybook **before** moving to integration.

### 8.7.2 — `PhotoGrid`

Thumbnail grid of section photos. Fixed-column layout (2 columns). Tapping a photo calls `onPress(index)` to open `PhotoGallery`. Each cell shows a thumbnail image with the `Image` component (RN built-in; `expo-image` swap is deferred to Phase 11).

```
src/screens/section/media/PhotoGrid.tsx
src/screens/section/media/PhotoGridItem.tsx
src/screens/section/media/PhotoGrid.stories.tsx
```

**Stories:** 1 photo, 4 photos (fills 2 rows), empty (no photos).

### 8.7.3 — `VideoList`, `VideoItem`, `BlogList`, `BlogItem`

`VideoItem` renders a video thumbnail (still image) with a play-icon overlay. Tapping opens a `WebView` for embedded video playback (YouTube/Vimeo). `VideoThumbPlaceholder` renders a colored placeholder when no thumbnail is available.

`BlogItem` renders a blog post link with title and source domain.

```
src/screens/section/media/VideoList.tsx
src/screens/section/media/VideoItem.tsx
src/screens/section/media/VideoThumbPlaceholder.tsx
src/screens/section/media/BlogList.tsx
src/screens/section/media/BlogItem.tsx
```

No Storybook stories needed (simple presentational components).

### 8.7.4 — `SectionMediaScreen` — integration

Wire everything into the media tab. `SectionMediaScreenContent` groups media nodes by kind (`groupBy(nodes, 'kind')`), then renders:

1. Photo section heading → `PhotoGrid` (tapping opens `PhotoGallery`)
2. Video section heading → `VideoList`
3. Blog section heading → `BlogList`

`SectionMediaScreen` wraps the content in a `ScrollView`, wires `useFocusEffect` to set `headerRight = null`, and includes a `SectionFAB` spacer at the bottom.

Data flow: media nodes are **already fetched** as part of the `sectionDetails` query (because `SectionProvider` is called with `thumbSize={PHOTO_SIZE_PX}`, which sets `withMedia: true`). No separate query is needed here — `useSection()` returns `section.media.nodes` with `image` and `thumb` URLs already populated.

```
src/screens/section/media/SectionMediaScreenContent.tsx
src/screens/section/media/SectionMediaScreen.tsx
```

**After this step:** media tab displays photos in a grid; tapping opens the fullscreen gallery with pinch-to-zoom and swipe navigation; videos show embedded player; blog links are tappable.

---

## 8.8 — Validation

### Per-step checkpoints

**After 8.3:**
- [ ] Navigating to a section from the sections list works
- [ ] Four tabs render (three if no gauge) with `PaperTabBar`
- [ ] Section name appears in header when data loads
- [ ] `SectionFAB` is visible above the tab bar
- [ ] `headerRight` is null for map and media tabs (placeholder screens), no crashes

**After 8.4:**
- [ ] Map tab renders section shape with put-in/take-out markers
- [ ] POIs visible on map; tapping a POI opens `SelectedPOISheet`
- [ ] Camera frames the section on load

**After 8.5:**
- [ ] Info tab shows difficulty, length, season, and other metadata rows
- [ ] Table expands when "more" is tapped
- [ ] Section description renders as formatted markdown
- [ ] Coordinates copy to clipboard on button press
- [ ] Info menu appears in header; actions navigate correctly

**After 8.6:**
- [ ] Chart tab renders measurement data as a line chart
- [ ] Interactive crosshair appears on touch
- [ ] Period toggle changes the time range
- [ ] Unit toggle (if gauge has both units) switches between flow/level
- [ ] Collapse button in header shrinks the controls section
- [ ] Pull-to-refresh reloads chart data
- [ ] No gauge → "no gauge" placeholder shown; chart tab hidden from tab bar

**After 8.7:**
- [ ] (Storybook) `PhotoGallery` opens, pinch zooms, double-tap zooms, swipe changes photo, swipe-down closes
- [ ] Media tab shows photo grid, video list, blog list
- [ ] Tapping a photo opens `PhotoGallery` at the correct index
- [ ] Video items are tappable (open embedded player)

### Final validation

- [ ] **Storybook:** `NoChart` (all reasons), `Crosshair`, `ChartComponent` (all variants), `ChartFlowToggle`, `ChartPeriodToggle`, `GaugeInfo`, `ChartLayout`, `TextWithLinks`, `CoordinatesInfo`, `PhotoGrid`, `PhotoGallery` (zoom + swipe)
- [ ] **Unit tests:** chart data formatting utilities, `useChartMeasurements` (if applicable), `getSectionContentBounds`, `getSectionInfoTableRowCount`
- [ ] **TypeScript:** `cd apps/mobile2 && pnpm tsc --noEmit` — no errors in changed files
- [ ] **Detox E2E:** Navigate to section → view info tab → expand table → copy coordinates → switch to chart → interact crosshair → zoom chart → switch to map → tap POI → switch to media → tap photo → zoom in gallery → swipe to next → swipe down to close
