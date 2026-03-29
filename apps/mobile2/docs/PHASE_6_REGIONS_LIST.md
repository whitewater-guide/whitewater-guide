# Phase 6: Regions List (first real data screen)

**Goal:** App displays the main regions list from the backend (i18n already set up in Phase 3).

---

## 6.1 — Build Regions List screen

- Port `RegionsListScreen` with actual data from backend
- Region cards with name, description, thumbnail
- Pull-to-refresh
- Use `@shopify/flash-list` instead of `react-native-big-list`
- Port favorite regions functionality

---

## 6.2 — Build shared components needed

- `Loading` spinner
- `ErrorBoundary` + fallback
- `RetryPlaceholder`
- `Screen` wrapper
- `Row` layout
- `WithQueryError` wrapper
- Image component (evaluate `expo-image` vs fast-image fork)

---

## 6.3 — Wire i18n to Apollo

- Language switch triggers Apollo cache purge
- Verify localized content from backend displays correctly

---

## 6.4 — Validation

- [ ] Regions list loads and displays from backend
- [ ] Language switches correctly (test EN ↔ RU)
- [ ] Pull-to-refresh works
- [ ] Error states display correctly
- [ ] **Unit tests:** RegionsList with mocked Apollo
- [ ] **Storybook:** RegionCard, Loading, ErrorBoundary, RetryPlaceholder
- [ ] **Detox E2E:** Launch → sign in → see regions list → pull to refresh
