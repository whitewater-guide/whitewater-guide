# Phase 4: Navigation Research & Reference

Detailed analysis of the existing navigation patterns, screen-to-screen transitions, and non-trivial behaviors that must be ported to the new app.

---

## Table of Contents

- [1. Navigation map (screen-to-screen transitions)](#1-navigation-map-screen-to-screen-transitions)
  - [REGIONS_LIST](#regions_list)
  - [REGION_STACK → REGION_TABS](#region_stack--region_tabs)
  - [SECTION_SCREEN → SECTION_TABS](#section_screen--section_tabs)
  - [DESCENT](#descent)
  - [DESCENT_FORM → DescentFormStack](#descent_form--descentformstack)
  - [ADD_SECTION_SCREEN → AddSectionStack](#add_section_screen--addsectionstack)
  - [AUTH_STACK](#auth_stack)
  - [PURCHASE_STACK](#purchase_stack)
  - [LOGBOOK](#logbook)
  - [Single-screen entries](#my_profile-plain-web_view-license-suggestion-chat)
  - [Drawer sidebar](#drawer-sidebar)
- [2. Non-trivial navigation patterns](#2-non-trivial-navigation-patterns)
  - [2.1 — Fake chat tab (tab press interception)](#21--fake-chat-tab-tab-press-interception)
  - [2.2 — Tab screens dynamically modifying parent header](#22--tab-screens-dynamically-modifying-parent-header)
  - [2.3 — Drawer swipe gating via focus effect](#23--drawer-swipe-gating-via-focus-effect)
  - [2.4 — Complex stack reset: descent form with pre-built internal state](#24--complex-stack-reset-descent-form-with-pre-built-internal-state)
  - [2.5 — Form state hydration via navigation params](#25--form-state-hydration-via-navigation-params)
  - [2.6 — Add Section → Descent Form cross-flow navigation](#26--add-section--descent-form-cross-flow-navigation)
  - [2.7 — Conditional tab visibility](#27--conditional-tab-visibility)
  - [2.8 — Custom header with integrated search](#28--custom-header-with-integrated-search)
  - [2.9 — Sign-out navigation reset + Apollo cache cleanup](#29--sign-out-navigation-reset--apollo-cache-cleanup)
  - [2.10 — Deep linking (manual URL parsing)](#210--deep-linking-manual-url-parsing)
  - [2.11 — Purchase flow parameter forwarding](#211--purchase-flow-parameter-forwarding)
  - [2.12 — useScrollToTop for tab integration](#212--usescrolltotop-for-tab-integration)
  - [2.13 — Navigation tracking for analytics](#213--navigation-tracking-for-analytics)
  - [2.14 — RegionTitle and SectionTitle as headerTitle](#214--regiontitle-and-sectiontitle-as-headertitle)
  - [2.15 — Global gesture and animation disabling](#215--global-gesture-and-animation-disabling)
- [3. Navigation state persistence and clearing](#3-navigation-state-persistence-and-clearing)
  - [Persistence mechanism](#persistence-mechanism)
  - [State clearing](#state-clearing)
  - [Form state within navigation state](#form-state-within-navigation-state)

---

## 1. Navigation map (screen-to-screen transitions)

What follows is a map of "what the user sees on the phone" and where they can navigate from each visible screen. A "screen" here means the full visible surface (header + tab bar + content), not just a React component.

### REGIONS_LIST

- **Header**: menu button (opens drawer), search icon (activates region search)
- **Drawer swipe**: enabled (only on this screen and LOGBOOK)
- **Navigates to**:
  - `REGION_STACK` — tap a region card
  - Drawer items: MY_PROFILE, AUTH_STACK, LOGBOOK, WEB_VIEW (FAQ/Backers/Terms/Privacy)

### REGION_STACK → REGION_TABS

Three visible tabs + one fake tab. Header shows custom `RegionTitle` component.

| Tab                           | Content                  | Header right                                | Navigates to                                                          |
| ----------------------------- | ------------------------ | ------------------------------------------- | --------------------------------------------------------------------- |
| **REGION_MAP**                | Map with section markers | FilterButton (conditional on sections data) | `SECTION_SCREEN` (tap marker), `FILTER` (tap header filter)           |
| **REGION_SECTIONS_LIST**      | Scrollable section list  | FilterButton                                | `SECTION_SCREEN` (tap item), `FILTER` (tap header filter)             |
| **REGION_INFO**               | Region info              | RegionInfoMenu                              | `WEB_VIEW`, `LICENSE`, `PLAIN` (from menu)                            |
| **REGION_FAKE_CHAT** _(fake)_ | —                        | —                                           | `CHAT` (if authenticated + room), `AUTH_STACK` (if not authenticated) |

- **FAB** (RegionFAB, overlaid): `ADD_SECTION_SCREEN`, `DESCENT_FORM`
- **Filter screen** (`FILTER`): pushed onto REGION_STACK above tabs, has its own header without search

### SECTION_SCREEN → SECTION_TABS

Four visible tabs + one fake tab. Header title set once via `useEffectOnce`. `initialRouteName` is `SECTION_INFO`.

| Tab                            | Content                                                    | Header right                        | Navigates to                                                          |
| ------------------------------ | ---------------------------------------------------------- | ----------------------------------- | --------------------------------------------------------------------- |
| **SECTION_MAP**                | Map                                                        | `null` (clears parent header right) | —                                                                     |
| **SECTION_CHART**              | Gauge chart (conditional: only shown if section has gauge) | Collapse/expand toggle button       | `WEB_VIEW` (gauge action sheet)                                       |
| **SECTION_INFO**               | Section details                                            | SectionInfoMenu                     | `WEB_VIEW`, `LICENSE`, `PLAIN`, `REGION_STACK`                        |
| **SECTION_MEDIA**              | Photos/videos                                              | `null` (clears parent header right) | —                                                                     |
| **SECTION_FAKE_CHAT** _(fake)_ | —                                                          | —                                   | `CHAT` (if authenticated + room), `AUTH_STACK` (if not authenticated) |

- **FAB** (SectionFAB, overlaid): `SUGGESTION`, `DESCENT_FORM` (via parent dispatch + state reset), image picker → `SUGGESTION`

### DESCENT

- Single screen showing descent details
- **Navigates to**: `DESCENT_FORM` (edit/duplicate via `useNavigateToForm`)

### DESCENT_FORM → DescentFormStack

Nested stack navigator with 4 sequential screens: SECTION → DATE → LEVEL → COMMENT.

- **Navigates to**: `ADD_SECTION_SCREEN` (from section picker via AddNewHeader)
- On section screen, "Add new" item dispatches to `ADD_SECTION_SCREEN` with `fromDescentFormKey` param

### ADD_SECTION_SCREEN → AddSectionStack

Nested stack with tabs (ADD_SECTION_TABS) + sub-screens (RIVER, GAUGE, SHAPE, PHOTO).

- **Header right**: SubmitButton (on tabs screen)
- **Navigates to**: On submit success, either `goBack()` or resets to `DESCENT_FORM` (if `fromDescentFormKey` is set)

### AUTH_STACK

Nested stack: AUTH_MAIN → AUTH_SIGN_IN, AUTH_REGISTER, AUTH_FORGOT, AUTH_RESET, AUTH_SOCIAL, AUTH_WELCOME.

- Custom header style (primary background, no border/elevation)
- Android: manual status bar margin offset
- **Navigates to**: `getParent()?.goBack()` on successful auth (closes entire auth modal)

### PURCHASE_STACK

Nested stack: PURCHASE_BUY → PURCHASE_ALREADY_HAVE, PURCHASE_VERIFY, PURCHASE_SUCCESS.

- `cardStyle` with manual safe area top margin
- Params forwarded from root to all child screens via `initialParams`
- **Navigates to**: `getParent()?.goBack()` from CloseButton, AlreadyHaveScreen, SuccessScreen (closes entire purchase modal)

### LOGBOOK

- **Drawer swipe**: enabled (same pattern as REGIONS_LIST)
- Custom header via `getHeaderRenderer(true)` (top-level = shows menu button)
- **Navigates to**: `DESCENT` (tap list item)

### MY_PROFILE, PLAIN, WEB_VIEW, LICENSE, SUGGESTION, CHAT

Single-screen entries on the RootStack. Standard back navigation.

### Drawer sidebar

| Item             | Target               | Auth required                  | Navigation method      |
| ---------------- | -------------------- | ------------------------------ | ---------------------- |
| My Profile       | MY_PROFILE           | Yes                            | `navigate`             |
| Sign In          | AUTH_STACK           | No (shown when logged out)     | `navigate`             |
| Regions          | REGIONS_LIST         | No                             | `reset` (clears stack) |
| Logbook          | LOGBOOK / AUTH_STACK | Yes → LOGBOOK, No → AUTH_STACK | `reset` / `navigate`   |
| FAQ              | WEB_VIEW             | No                             | `navigate`             |
| Backers          | WEB_VIEW             | No                             | `navigate`             |
| Terms of Service | WEB_VIEW             | No                             | `navigate`             |
| Privacy Policy   | WEB_VIEW             | No                             | `navigate`             |

---

## 2. Non-trivial navigation patterns

This section documents navigation behaviors that go beyond simple `navigate`/`goBack`/`replace` and will need careful porting.

### 2.1 — Fake chat tab (tab press interception)

**Files**: `screens/region/useFakeChatTab.ts`, `screens/section/useFakeChatTab.ts`

Both `RegionTabs` and `SectionTabs` have a "chat" tab that is not a real screen — its component is just `View`. The tab uses `listeners` prop with a `tabPress` handler that calls `e.preventDefault()` to block the default tab switch, then navigates to:

- `AUTH_STACK` if user is not authenticated
- `CHAT` screen (on the RootStack) if authenticated and room exists

This uses `CompositeNavigationProp` to combine the tab navigator's type with the parent stack's type, so `navigation.navigate(Screens.CHAT)` targets the RootStack, not the tab navigator.

**V7 migration**:

- `@react-navigation/material-bottom-tabs` is removed in v7. Use `react-native-paper/react-navigation`'s `createMaterialBottomTabNavigator` instead.
- The `listeners` prop on `Tab.Screen` still works, but an alternative approach in v7 is to use `navigation.addListener('tabPress', e => { e.preventDefault(); ... })` inside the screen component via `useEffect`. This is the pattern shown in v7 docs and decouples the interception logic from the navigator definition.
- `CompositeNavigationProp` is replaced by `CompositeScreenProps` in v7 for type-safe access to parent navigators. Alternatively, use `navigation.getParent<ParentNavigationType>('parentId')` with navigator `id` props for typed access to the root stack's `navigate`.

### 2.2 — Tab screens dynamically modifying parent header

**Files**: Most tab screen files under `screens/region/` and `screens/section/`

Every tab screen inside `RegionTabs` and `SectionTabs` uses `useFocusEffect` + `navigation.getParent()?.setOptions()` to change the parent stack navigator's `headerRight` content when that tab gains focus. This is needed because the header belongs to the parent stack, not the tab navigator.

Pattern:

```ts
useFocusEffect(
  React.useCallback(() => {
    navigation.getParent()?.setOptions({
      headerRight: () => <SomeButton />,
    });
  }, [navigation, ...deps]),
);
```

Examples:

- **RegionSectionsListScreen** / **RegionMapScreen**: shows `<FilterButton />`
- **RegionInfoScreen**: shows `<RegionInfoMenu />`
- **SectionInfoScreen**: shows `<SectionInfoMenu section={section} />`
- **SectionChartScreen**: shows collapse/expand toggle (depends on local `collapsed` state and `gauge` data)
- **SectionMapScreen** / **SectionMediaScreen**: clears header right to `null`

**V7 migration**:

- `navigation.getParent()` still works in v7 but should now use navigator `id` for specificity: `navigation.getParent('RegionStackId')?.setOptions(...)`. Assign `id` props to parent navigators to avoid ambiguity when nesting depth changes.
- `useFocusEffect` and `setOptions` APIs are unchanged in v7. This pattern ports directly.
- If migrating to native stack (`@react-navigation/native-stack`), `headerRight` accepts a function `({ tintColor, canGoBack }) => ReactNode` — verify the callback signature matches.

### 2.3 — Drawer swipe gating via focus effect

**Files**: `screens/regions-list/RegionsListScreen.tsx`, `screens/logbook/LogbookScreen.tsx`

Drawer swipe is globally disabled (`swipeEnabled: false` in `RootDrawer`). Only `RegionsListScreen` and `LogbookScreen` re-enable it when focused:

```ts
useFocusEffect(
  useCallback(() => {
    navigation.getParent()?.setOptions({ swipeEnabled: true });
    return () => {
      navigation.getParent()?.setOptions({ swipeEnabled: false });
    };
  }, [navigation]),
);
```

The cleanup function ensures swipe is disabled again when navigating away.

**V7 migration**:

- `swipeEnabled` option on the drawer navigator is unchanged in v7. The `useFocusEffect` + `getParent()?.setOptions()` pattern ports directly.
- Use `getParent('DrawerId')` with an `id` prop on the drawer navigator for type-safe access.

### 2.4 — Complex stack reset: descent form with pre-built internal state

**Files**: `screens/add-section/resetToDescentForm.ts`, `screens/section/SectionFAB.tsx`, `screens/descent/useNavigateToForm.ts`

Multiple places programmatically build a `DESCENT_FORM` route with pre-defined internal stack state (navigating directly to the DATE step, skipping SECTION):

```ts
{
  name: Screens.DESCENT_FORM,
  params: { formData: { section, startedAt, public: true } },
  state: {
    index: 1,
    routes: [
      { name: Screens.DESCENT_FORM_SECTION },
      { name: Screens.DESCENT_FORM_DATE },    // ← user lands here
    ],
  },
}
```

Three distinct patterns:

1. **`resetToDescentForm`** — Used after creating a section from within the descent form flow. Finds the existing `DESCENT_FORM` route in the stack, truncates everything after it, and replaces it with a fresh form pre-filled with the new section. Called via `navigation.dispatch(state => resetToDescentForm(state, section))`.

2. **`SectionFAB` "Add Descent"** — Appends a new `DESCENT_FORM` to the parent stack's routes by using `getParent()?.dispatch(navState => CommonActions.reset({...navState, routes: [...navState.routes, newRoute]}))`. Must use parent dispatch because SectionFAB lives inside a tab navigator.

3. **`useNavigateToForm`** (edit/duplicate) — On the Descent detail screen, replaces the current DESCENT route with DESCENT_FORM by popping the last route and pushing the form. Uses `navigation.reset()` with a modified copy of `getState()`.

**V7 migration**:

- `CommonActions.reset()` and `navigation.dispatch(state => ...)` (action creators receiving current state) are unchanged in v7. These patterns port directly.
- `navigation.getParent()?.dispatch(...)` works the same but should use `id` for specificity.
- **Key change**: `navigate` in v7 no longer goes back to an existing screen in the stack — it always pushes. Code that relied on `navigate` to jump back to `DESCENT_FORM` must use `popTo('DESCENT_FORM', params)` instead. The `reset`-based patterns here avoid this issue since they manipulate state directly.

### 2.5 — Form state hydration via navigation params

**File**: `screens/descent-form/DescentFormContext.tsx`

The descent form is a multi-screen wizard (Section → Date → Level → Comment). Form state is managed by Formik, but since navigation state persistence serializes/restores the navigation tree on app restart, Formik state would be lost.

Solution: `useNavHydrateFormik` copies Formik values into navigation params on every focus-lost event:

```ts
function useNavHydrateFormik(formScreenKey: string) {
  const { dispatch } = useNavigation();
  const { values } = useFormikContext();
  const valuesRef = useRef(values);
  valuesRef.current = values;

  useFocusEffect(
    useCallback(
      () => () => {
        dispatch({
          ...CommonActions.setParams({ formData: valuesRef.current }),
          source: formScreenKey,
        });
      },
      [dispatch, valuesRef, formScreenKey],
    ),
  );
}
```

Key details:

- Uses a ref (`valuesRef`) to always capture the latest form values without re-triggering the focus effect
- The `source: formScreenKey` ensures params are set on the correct route in the stack
- On app restart, `usePersistence` restores the navigation state including these params, and `useInitialDescent` reads them to re-initialize Formik

**V7 migration**:

- `CommonActions.setParams()` with a `source` key is unchanged in v7. This pattern ports directly.
- `useFocusEffect` cleanup callback (blur handler) works identically.
- Navigation state serialization format is the same, so persistence-based hydration is unaffected.

### 2.6 — Add Section → Descent Form cross-flow navigation

**Files**: `screens/descent-form/section/AddNewHeader.tsx`, `screens/add-section/useAddSection.ts`

The descent form's section picker has an "Add new section" button. Pressing it:

1. Uses `navigation.dispatch(state => CommonActions.navigate({ name: ADD_SECTION_SCREEN, params: { fromDescentFormKey: state.key } }))` — captures the current navigation state key
2. After section creation succeeds, `useAddSection` checks for `fromDescentFormKey` and calls `navigation.dispatch(state => resetToDescentForm(state, newSection))` to return to the descent form with the new section pre-filled

This creates a round-trip flow: DescentForm → AddSection → (on success) → back to DescentForm with new section data.

**V7 migration**:

- `CommonActions.navigate()` inside a `dispatch(state => ...)` callback is unchanged. The state-callback variant of dispatch still works in v7.
- **Key change**: `navigate` in v7 no longer implicitly navigates back to an existing screen. If `ADD_SECTION_SCREEN` is already in the stack, v6's `navigate` would go back to it, but v7 will push a new instance. Since this flow uses `dispatch(state => CommonActions.navigate(...))`, the behavior is explicit and should be fine. However, audit any non-dispatch `navigate` calls in this flow — they may need to use `popTo` instead.
- The `resetToDescentForm` state manipulation is low-level and bypasses `navigate`, so it is v7-safe.

### 2.7 — Conditional tab visibility

**File**: `screens/section/SectionTabs.tsx`

The `SECTION_CHART` tab is conditionally rendered based on `section?.gauge`:

```tsx
{!!section?.gauge && (
  <Tab.Screen name={Screens.SECTION_CHART} component={LazySectionChartScreen} ... />
)}
```

This means the number of visible tabs varies per section.

**V7 migration**:

- Conditionally rendering `Tab.Screen` components is still supported in v7 with the dynamic API (`createMaterialBottomTabNavigator` from `react-native-paper`). This pattern ports directly.
- If migrating to the static API (`createStaticNavigation`), conditional screens are **not** supported — the screen list must be fixed. Stick with the dynamic API for this use case.

### 2.8 — Custom header with integrated search

**Files**: `components/header/Header.tsx`, `components/header/useHeaderSearch.ts`, `components/header/getHeaderRenderer.tsx`

The header is a custom component (not react-navigation's default) that supports an integrated search mode:

- **Search context pair**: Screens that support search pass a `SearchContexts` tuple `[StringContext, SetterContext]` via the `getHeaderRenderer()` factory. The header reads search state from one context and writes via the other.
- **Debounced sync**: The header maintains local `searchInput` state for immediate UI feedback, then debounces (200ms) before writing to the shared context that filters the list.
- **Mode toggling**: When search is active, HeaderLeft shows a back/cancel button, HeaderCenter becomes a TextInput, and HeaderRight shows a clear button — completely replacing the normal header UI.
- **Auto-focus**: When search becomes active, the TextInput is automatically focused via ref.
- **Drawer access hack**: `(navigation as any).openDrawer()` — the header receives `StackHeaderProps` which doesn't include drawer methods, so it uses an unsafe cast.

**V7 migration**:

- Custom `header` option (via `getHeaderRenderer`) is unchanged in v7. The `StackHeaderProps` / `NativeStackHeaderProps` type is the same.
- **Drawer access hack fix**: In v7, use `navigation.getParent('DrawerId').openDrawer()` with a typed navigator `id`. This eliminates the unsafe `as any` cast. Assign `id="DrawerId"` to the drawer navigator and use `useNavigation<DrawerNavigationProp>()` or `getParent<DrawerNavigationProp>('DrawerId')`.
- The search context pattern is a React concern, not a navigation concern — no changes needed.

### 2.9 — Sign-out navigation reset + Apollo cache cleanup

**File**: `core/navigation/useSignOut.ts`

On sign-out, the app must:

1. Reset navigation to `REGIONS_LIST` via a deeply nested reset structure targeting `ROOT_STACK > REGIONS_LIST`
2. Pause Apollo cache persistence, purge the persisted cache, reset the Apollo store, then resume persistence

This ensures no user-specific data lingers in either navigation state or Apollo cache.

**V7 migration**:

- `CommonActions.reset()` with nested state structures is unchanged in v7. The sign-out reset pattern ports directly.
- **Navigate behavior change**: If any part of the sign-out flow uses `navigate` to go to `REGIONS_LIST` (a screen that may already be in the stack), v7 would push a new instance instead of going back. The `reset`-based approach here avoids this — it replaces the entire state, which is correct.

### 2.10 — Deep linking (manual URL parsing)

**File**: `core/navigation/useLinking.ts`

Deep linking is implemented manually rather than using react-navigation's `linking` config prop. The hook:

1. Checks `Linking.getInitialURL()` on mount for cold-start deep links
2. Subscribes to `Linking.addEventListener('url', ...)` for warm-start deep links
3. Parses URLs with `url-parse` library and pattern-matches against known paths:
   - `${DEEP_LINKING_URL}/auth/local/reset/callback?id=X&token=Y` → navigates to `AUTH_STACK > AUTH_RESET`
   - `${DEEP_LINKING_URL}/auth/local/connect-email?email=X&token=Y` → navigates to `CONNECT_EMAIL`
   - URLs containing `verified` → refreshes MyProfile Apollo query (no navigation)
4. Uses `useRef` for the navigate callback to avoid stale closures

**V7 migration**:

- The manual deep linking approach bypasses react-navigation's built-in `linking` config, so v7 changes to the linking config format (new `path` option at config root level) don't apply here.
- However, v7 significantly improved the built-in `linking` config. Consider migrating to the declarative `linking` prop on `NavigationContainer` instead of manual URL parsing. V7 supports `path` at the config root for base paths, and the `getStateFromPath`/`getPathFromState` customization points are more flexible.
- If keeping the manual approach: `Linking.getInitialURL()`, `Linking.addEventListener`, and programmatic `navigate`/`reset` calls are all unchanged. The `navigate` calls that target nested screens (e.g., `AUTH_STACK > AUTH_RESET`) must use the explicit nested syntax: `navigate('AUTH_STACK', { screen: 'AUTH_RESET', params: {...} })`. In v7, the shorthand `navigate('AUTH_RESET')` no longer traverses into child navigators by default (unless `navigationInChildEnabled` is set on the container).

### 2.11 — Purchase flow parameter forwarding

**File**: `screens/purchase/PurchaseStack.tsx`

The PurchaseStack receives params from the RootStack route and forwards them to ALL child screens via `initialParams={params}`. This means every screen in the purchase flow has access to the purchase context (region info, etc.) without needing to read from the parent.

Child screens use `getParent()?.goBack()` to dismiss the entire purchase modal stack.

**V7 migration**:

- `initialParams` forwarding is unchanged in v7.
- `getParent()?.goBack()` still works but should use `getParent('RootStackId')` with an `id` for type safety.
- **`cardStyle` removal**: If using `@react-navigation/native-stack` (recommended in v7), `cardStyle` is not available. Use `contentStyle` instead for styling the screen container. For safe area top margin, consider using `react-native-safe-area-context`'s `useSafeAreaInsets()` inside the screen component rather than applying it via navigator options.

### 2.12 — useScrollToTop for tab integration

**File**: `screens/region/sections-list/biglist/useBiglist.tsx`

`useScrollToTop(listRef)` registers the big list's scroll ref so that tapping the active "Sections" tab scrolls the list to the top (standard material bottom tab behavior).

**V7 migration**:

- `useScrollToTop` is unchanged in v7. It works with any tab navigator that supports the `tabPress` event (including the Paper-based material bottom tabs). This pattern ports directly.

### 2.13 — Navigation tracking for analytics

**File**: `core/navigation/useTracking.ts`

Wraps `NavigationContainer`'s `onReady` and `onStateChange` callbacks to track screen transitions via an error tracker. Compares previous and current route names, only firing `tracker.trackScreen` when the route actually changes. Chains with the persistence `onStateChange` callback.

**V7 migration**:

- `NavigationContainer`'s `onReady` and `onStateChange` props are unchanged in v7. This pattern ports directly.
- The `navigationRef.getCurrentRoute()` helper for extracting the current route name also works the same way.

### 2.14 — RegionTitle and SectionTitle as headerTitle

**Files**: `screens/region/RegionStack.tsx`, `screens/section/SectionTabs.tsx`

Both use custom React components as `headerTitle`:

- `RegionStack`: `options={{ headerTitle: () => <RegionTitle region={region} /> }}`
- `SectionTabs`: `navigation.setOptions({ headerTitle: () => <SectionTitle section={section} /> })` (set once via `useEffectOnce`)

These render region/section names with custom styling rather than plain text titles.

**V7 migration**:

- `headerTitle` accepting a React component is unchanged in v7 for both `@react-navigation/stack` and `@react-navigation/native-stack`. The callback signature is `({ children, tintColor }) => ReactNode`.
- `navigation.setOptions()` and `useEffectOnce` work identically. No changes needed.

### 2.15 — Global gesture and animation disabling

**File**: `core/navigation/RootStack.tsx`

All stack navigators globally set:

- `gestureEnabled: false` — disables iOS back swipe everywhere (drawer swipe is selectively re-enabled per screen)
- `animationEnabled: Config.E2E_MODE !== 'true'` — disables transition animations during E2E tests for deterministic behavior

**V7 migration**:

- **`animationEnabled` is removed** in v7's stack navigator. Use `animation: 'none'` instead. The E2E conditional becomes: `animation: Config.E2E_MODE === 'true' ? 'none' : 'default'`.
- **`gestureEnabled`** is still available in `@react-navigation/native-stack` (unchanged). In `@react-navigation/stack` (JS-based), it also remains available.
- If migrating to native stack: `gestureEnabled` defaults to `true` and works identically. The option name is the same.

---

## 3. Navigation state persistence and clearing

### Persistence mechanism

**File**: `core/navigation/usePersistence.ts`

Navigation state is persisted to `AsyncStorage` under the key `'wwguide2'`.

**Save flow**:

1. `NavigationContainer` fires `onStateChange` on every navigation action
2. `useTracking` receives this callback, performs analytics tracking, then forwards to `usePersistence.onStateChange`
3. `onStateChange` serializes the entire navigation state tree to JSON and writes it to AsyncStorage

**Restore flow**:

1. On app launch, `usePersistence` reads from AsyncStorage and parses the stored JSON
2. While loading, `NavigationRoot` renders `<SplashScreen />` instead of the navigation tree
3. Once ready, the stored state is passed as `initialState` to `NavigationContainer`
4. The app resumes exactly where the user left off (same screen, same tab, same scroll position context)

**E2E mode**: When `Config.E2E_MODE === 'true'`, persistence is skipped entirely — `isReady` starts as `true` and no state is restored. This ensures E2E tests always start from a clean state.

### State clearing

Navigation state is cleared (reset) in two scenarios:

1. **Sign-out** (`useSignOut.ts`): Resets to `ROOT_STACK > REGIONS_LIST`. The next `onStateChange` will overwrite the persisted state with this minimal state. Also clears Apollo cache persistence (pause → purge → resetStore → resume).

2. **Drawer "Regions" / "Logbook" items** (`DrawerSidebar.tsx`): Uses `navigation.reset()` to replace the entire stack with a single route. This effectively clears forward/back history.

### Form state within navigation state

The descent form hydration pattern (§2.5) stores Formik values inside navigation params. This means form-in-progress data survives app restarts via the same AsyncStorage persistence. On restore, `useInitialDescent` reads `route.params.formData` and re-initializes Formik.
