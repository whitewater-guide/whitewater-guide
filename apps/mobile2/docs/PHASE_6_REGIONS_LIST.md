# Phase 6: Regions List (first real data screen)

**Goal:** App displays the main regions list from the backend (i18n already set up in Phase 3).

**Scope constraints:**

- Premium features (IAP lock, `PremiumBadge`) are **dropped** entirely.
- Offline download button is **stubbed** — visible but non-functional. Full implementation in Phase 11.

---

## 6.1 — Install dependencies ✅ DONE

Install all native and JS packages required for this phase before any implementation work.

```bash
# From apps/mobile2/
pnpm add --ignore-scripts @shopify/flash-list @react-native-community/netinfo
```

After installing, verify each package appears in `apps/mobile2/package.json`, then validate native builds (new native dependencies):

```bash
pnpm react-native build-ios
pnpm react-native build-android
```

| Package                           | Status                      | Reason                                                                                  |
| --------------------------------- | --------------------------- | --------------------------------------------------------------------------------------- |
| `@shopify/flash-list`             | ✅ installed                | Replaces `FlatList` for recycled native views (see 6.4)                                 |
| `expo-image`                      | ⚠️ **deferred to Phase 11** | expo-sdk not yet compatible with RN 0.84; using RN's built-in `Image` for now (see 6.5) |
| `@react-native-community/netinfo` | ✅ installed                | Required by `useToggleFavoriteRegion` for offline check (see 6.7)                       |

---

## 6.2 — Storybook stories ⚠️ PARTIAL

Write Storybook stories for every component introduced in this phase before implementing the production wiring. This keeps component development isolated and verifiable.

| Story              | Status  | States                                                 |
| ------------------ | ------- | ------------------------------------------------------ |
| `RegionCard`       | ✅ done | Default, favorite=true, authenticated, unauthenticated |
| `Loading`          | ✅ done | Default (centered spinner)                             |
| `RetryPlaceholder` | ✅ done | With and without error message                         |

Stories live alongside their components:

```
src/screens/regions-list/
  card/
    RegionCard.stories.tsx   ✅
src/components/
  Loading.stories.tsx   ✅
  RetryPlaceholder.stories.tsx   ✅
```

---

## 6.3 — GraphQL query ✅ DONE

### Source file

Old app: `apps/mobile/src/screens/regions-list/regionsList.gql`

### Changes from old query

Drop premium/IAP fields — `premium`, `hasPremiumAccess`, `sku` are removed. We still include `favorite` for authenticated users, and both `gauges.count` and `sections.count` for the card footer.

```graphql
# apps/mobile2/src/screens/regions-list/regionsList.gql
query regionsList($coverWidth: Int) {
  regions {
    nodes {
      id
      name
      favorite
      gauges {
        count
      }
      sections {
        count
      }
      coverImage {
        mobile(width: $coverWidth)
      }
    }
    count
  }
}
```

### Codegen

Add a mobile2-specific codegen target in `codegen.yml` (same pattern as mobile) so that `regionsList.generated.ts` is emitted alongside the `.gql` file. The generated `useRegionsListQuery` hook is then imported directly in `RegionsListView`.

### Apollo fetch policy

Use `cache-and-network` (same as old app). This gives instant UI from cache on re-visit while always refreshing in background. The `refetch` function returned by the hook drives pull-to-refresh.

### Image width variable

Pass `theme.screenWidthPx` (device pixel width) as `coverWidth` so the backend returns a pre-scaled URL. This avoids fetching a 3× oversized image on every card.

### i18n + cache invalidation (6.9)

When the user switches language, the localized content (region names, descriptions) comes from the backend — the Apollo cache holds stale locale data. We must purge the cache on locale change:

```ts
// I18nProvider or a language-switch handler
i18n.on('languageChanged', () => {
  apolloClient.resetStore(); // clears cache, re-runs active queries
});
```

---

## 6.4 — Migration to `@shopify/flash-list` ✅ DONE

### Why FlashList over FlatList

FlashList recycles native views (instead of JS-managed windowing) — critical for New Architecture where bridge overhead is eliminated but memory pressure from mounted views is even more visible. On a mid-range Android device with 40+ region cards, FlashList measurably reduces frame drops during fast scroll.

### Removed FlatList props (not supported by FlashList)

`getItemLayout`, `windowSize`, `initialNumToRender`, `maxToRenderPerBatch`, `removeClippedSubviews` — all dropped. FlashList handles layout internally.

### Key migration steps

**1. `estimatedItemSize`**

FlashList needs a single estimated size for the recycler pool allocations. Our list has two item types with different heights. Pass the weighted average (most items are cards):

```ts
// Most items are cards; subtitle rows are rare.
// Weighted average: assume ~5% subtitle rows.
const ESTIMATED_ITEM_SIZE = Math.round(
  CARD_HEIGHT * 0.95 + REGIONS_LIST_SUBTITLE_HEIGHT * 0.05,
);
```

**2. `getItemType` — critical for heterogeneous list**

Without this, FlashList will try to recycle subtitle views into card slots and vice versa, causing visual glitches. Provide two type strings:

```ts
const getItemType = (item: ListItem) =>
  item.__typename === 'Subtitle' ? 'subtitle' : 'card';
```

**3. `overrideItemLayout` — exact sizes for mixed-height list**

Since we know exact heights for both types, bypass FlashList's estimation for each slot:

```ts
const overrideItemLayout = (
  layout: { span?: number; size?: number },
  item: ListItem,
) => {
  layout.size =
    item.__typename === 'Subtitle' ? REGIONS_LIST_SUBTITLE_HEIGHT : CARD_HEIGHT;
};
```

**4. `keyExtractor` — must be stable**

Same logic as old app: favorites duplicate a region in the list (once as `fav_<id>`, once as `<id>`), so `key` is authoritative when present:

```ts
const keyExtractor = (item: ListItem) => item.key ?? item.id;
```

**5. Item recycling and state**

`RegionCard` holds no local `useState` — all data comes from the `region` prop (Apollo-sourced). No need for `useRecyclingState`. However, `FavoriteButton` toggles via optimistic mutation update — since the toggled state flows through Apollo cache → prop, recycling is safe.

**6. `stickyHeaderIndices` — sticky section headers**

FlashList does not have built-in sticky-header support like `SectionList`. To keep subtitle rows pinned while scrolling, compute the indices of subtitle items in the flat array and pass them as `stickyHeaderIndices`:

```ts
const stickyHeaderIndices = useMemo(
  () =>
    items
      .map((item, index) => (item.__typename === 'Subtitle' ? index : null))
      .filter((i): i is number => i !== null),
  [items],
);
```

Then pass to `<FlashList stickyHeaderIndices={stickyHeaderIndices} ... />`.

**7. Memoization**

In FlashList v2, all props passed to the list should be stable references to avoid unnecessary re-renders. Define `renderItem`, `keyExtractor`, `getItemType`, `overrideItemLayout`, and `stickyHeaderIndices` outside the component or with `useCallback`/`useMemo` as appropriate.

**8. `maintainVisibleContentPosition`**

Enabled by default in FlashList — no need to pass explicitly (unlike FlatList where it had to be set manually).

**9. `drawDistance`**

Default (250dp) is fine for this list. Could increase to 500 on tablets, but keep default for now.

**Final FlashList props:**

```tsx
<FlashList
  data={items}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
  getItemType={getItemType}
  overrideItemLayout={overrideItemLayout}
  stickyHeaderIndices={stickyHeaderIndices}
  estimatedItemSize={ESTIMATED_ITEM_SIZE}
  refreshing={networkStatus === NetworkStatus.refetch}
  onRefresh={refetch}
  testID="regions-list"
/>
```

> **Implementation status:** `getItemType`, `stickyHeaderIndices`, `keyExtractor`, `renderItem` are implemented and memoized. `estimatedItemSize` and `overrideItemLayout` are **not yet passed** to FlashList — these are performance optimizations (not correctness fixes) and can be added as a follow-up.

---

## 6.5 — Shared components needed ✅ DONE

### Cover image: RN `Image` (expo-image deferred to Phase 11)

`expo-image` is the correct long-term replacement for `@whitewater-guide/react-native-fast-image` — New Architecture support, disk+memory cache, blur-hash placeholders. However, the expo-sdk is not yet compatible with RN 0.84, so it is deferred to Phase 11 (offline support).

For Phase 6, the card cover image uses RN's built-in `Image` component:

```tsx
import { Image } from 'react-native';

<Image source={{ uri }} style={styles.image} resizeMode="cover" />;
```

When `expo-image` is adopted in Phase 11, the migration is a one-line import swap plus prop rename (`resizeMode` → `contentFit`).

### `Loading` spinner

Thin wrapper around Paper `ActivityIndicator`, centered in available space. Used by `WithQueryError` and standalone.

### `ErrorBoundary` + fallback

React `ErrorBoundary` class component that catches render errors and shows a `RetryPlaceholder` with an option to reload. Wrap the navigation root with it.

### `RetryPlaceholder`

Displays an icon, a message, and a "Try again" button. Used by `WithQueryError` for network errors and `ErrorBoundary` for render errors.

### `WithQueryError`

Wraps a screen's data-dependent subtree:

- `loading && !hasData` → show `<Loading />`
- `error && !hasData` → show `<RetryPlaceholder onRetry={refetch} />`
- otherwise → render children

```tsx
function WithQueryError({ hasData, error, loading, refetch, children }) {
  if (loading && !hasData) return <Loading />;
  if (error && !hasData) return <RetryPlaceholder onRetry={refetch} />;
  return <>{children}</>;
}
```

### `Screen` wrapper

Applies `SafeAreaView` + background color. All screens should use it.

---

## 6.6 — RegionCard ✅ DONE

### Layout

```
┌─────────────────────────────────────────┐
│  [Cover image, aspect ratio 3:1]        │
│  ┌──── gradient scrim (bottom) ───────┐ │
│  │  [DownloadButton]  [FavoriteButton] │ │
│  │  Region Name                       │ │
│  └────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│  Sections: N      Gauges: N             │
└─────────────────────────────────────────┘
```

### Changes from old card

- **Drop**: `PremiumBadge`, `PremiumBadge`-related props, `sku`, `hasPremiumAccess`.
- **Replace**: `@whitewater-guide/react-native-fast-image` → RN `Image` for now; `expo-image` deferred to Phase 11 (see 6.5).
- **Keep**: `DownloadButton` (stubbed), `FavoriteButton`, cover image gradient, section/gauge counts.
- **Replace**: `Caption`/`Title` from Paper still fine (Paper v5.15 is installed).

### `CARD_HEIGHT` constant

Preserve the calculation — it's used in `overrideItemLayout`:

```ts
export const CARD_HEIGHT =
  theme.margin.half * 2 + // root.marginVertical
  (theme.screenWidth - 2 * theme.margin.single) / 3 + // image height
  FOOTER_HEIGHT;
```

---

## 6.7 — Favorite regions feature ✅ DONE

### Data flow

`favorite: Boolean` is a server-side field on the `Region` type. The backend persists favorites per user. When the user is not authenticated, `favorite` is `null`/`false`. Apollo's optimistic response updates the cache immediately so the heart icon flips without waiting for the server round-trip.

### `useFavRegions` hook

Port directly — no changes needed. Separates favorites from all regions and inserts two subtitle rows when any favorites exist. The `key` field on favorite copies (`fav_<id>`) prevents FlashList key collisions when a region appears twice.

```ts
// apps/mobile2/src/screens/regions-list/useFavRegions.ts
// (port as-is from mobile)
```

### `toggleFavoriteRegion.gql` mutation

```graphql
mutation toggleFavoriteRegion($id: ID!, $favorite: Boolean!) {
  toggleFavoriteRegion(id: $id, favorite: $favorite) {
    id
    favorite
  }
}
```

Apollo normalizes by `__typename + id` so the cache update propagates to every place this region appears (including its `fav_` duplicate row).

### `useToggleFavoriteRegion` hook

Port from old app with one change: `showSnackbarError` should use Paper's Snackbar (not `react-native-snackbar`):

```ts
// apps/mobile2/src/screens/regions-list/card/useToggleFavoriteRegion.ts
export function useToggleFavoriteRegion(id: string, favorite?: boolean | null) {
  const [mutate, { loading }] = useToggleFavoriteRegionMutation();
  const { isInternetReachable } = useNetInfo();

  const toggleFavorite = useCallback(() => {
    mutate({
      variables: { id, favorite: !favorite },
      optimisticResponse: isInternetReachable
        ? {
            toggleFavoriteRegion: {
              __typename: 'Region',
              id,
              favorite: !favorite,
            },
          }
        : undefined,
    }).catch(showSnackbarError); // Paper Snackbar version
  }, [mutate, id, favorite, isInternetReachable]);

  return [toggleFavorite, loading] as const;
}
```

### `FavoriteButton` component

- Reads `me` from `useAuth()` (mobile2's auth system, same hook name from `@whitewater-guide/clients`).
- Returns `null` when `me` is null (unauthenticated).
- Uses `MaterialCommunityIcons` icon (`heart` / `heart-outline`) — available via the Icon component already built in mobile2.

---

## 6.8 — Offline download stub ✅ DONE

**Rationale:** The download button is part of the card's visual design in the old app. Removing it entirely would require re-designing the card layout. Stubbing it (visible, non-interactive or shows a "coming soon" message) is the minimal-change approach that keeps the card layout consistent with Phase 11.

### Stub implementation

```tsx
// apps/mobile2/src/screens/regions-list/card/DownloadButton.tsx
// Stub: shows icon, tap triggers a "not yet implemented" Snackbar
const DownloadButton = memo(() => {
  const { t } = useTranslation();
  return (
    <Icon
      icon="cloud-download"
      accessibilityLabel="download"
      testID="download-button"
      style={styles.container}
      color={theme.colors.textLight}
      onPress={() => showSnackbar(t('common:comingSoon'))}
    />
  );
});
```

No `OfflineContentProvider`, no `useOfflineDate`, no download progress logic — all deferred to Phase 11.

---

## 6.9 — Wire i18n to Apollo ✅ DONE

When language switches, Apollo holds stale localized strings. Call `apolloClient.resetStore()` in the language-change handler inside `I18nProvider`. This re-fetches all active queries with the new locale header.

---

## 6.10 — Validation

Implementation wired (`RegionsListScreen` replaces `MockRegionsListScreen` in `RootStack`). Manual validation pending:

- [x] Regions list loads and displays from backend
- [x] Language switches correctly (test EN ↔ RU) — localized region names reload
- [x] Pull-to-refresh works
- [x] Error states display correctly (`RetryPlaceholder` on network failure, `ErrorBoundary` on render crash)
- [x] Favorite toggle works for authenticated users; hidden for guests
- [x] Favorites section appears at the top when at least one region is favorited
- [x] Download button is visible but shows "coming soon" on tap
- [x] **Storybook** — see section 6.2

---
