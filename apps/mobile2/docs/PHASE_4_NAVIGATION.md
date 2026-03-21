# Phase 4: Core Navigation Shell

**Goal:** Full navigation skeleton with mock screens that exercise every click-based navigation transition. Drawer sidebar, deep linking, header, and comprehensive Detox E2E coverage. No real data — hardcoded IDs and placeholder content.

> **Reference:** Detailed navigation patterns, screen-to-screen transitions, and non-trivial behaviors are documented in [PHASE_4_NAVIGATION_RESEARCH.md](PHASE_4_NAVIGATION_RESEARCH.md).

---

## Implementation order

1. **Screen names & param types** (§4.3) — foundation for everything
2. **Paper theme** (§4.2) — needed before any UI
3. **PlaceholderScreen + mock screens** (§4.4) — components used by navigators
4. **Header component** (§4.6) — used by all stacks
5. **Nested navigators**: AuthStack, DescentFormStack, AddSectionStack (§4.5) — leaf navigators with no children to wire
6. **RegionStack + RegionTabs, SectionTabs** (§4.5) — tab navigators with FABs
7. **RootStack** (§4.5) — registers all screens
8. **DrawerSidebar + RootDrawer** (§4.5) — wraps RootStack
9. **NavigationRoot** (§4.5) — container with persistence + linking
10. **Deep linking** (§4.7) — JS-side linking config
11. **State persistence** (§4.8) — dev-mode nav state caching
12. **E2E tests: navigation without auth** (§4.9) — all non-auth-gated transitions
13. **Mock auth context + E2E tests: auth-gated flows** (§4.10) — implement mock auth toggle, then test auth-gated navigation

---

## 4.1 — Dependency review

All deps below are already installed from Phase 3. This section clarifies which are **actively used** in Phase 4 vs carried forward for later phases.

### Actively used in Phase 4

| Package                                            | Purpose                                                                             |
| -------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `@react-navigation/native`                         | Navigation container, hooks                                                         |
| `@react-navigation/native-stack`                   | RootStack, AuthStack, DescentFormStack, AddSectionStack                             |
| `@react-navigation/drawer`                         | RootDrawer                                                                          |
| `@react-navigation/material-top-tabs`              | AddSectionTabs (scrollable bottom-positioned top tabs)                              |
| `react-native-paper`                               | MD3 theme, material bottom tabs (`react-native-paper/react-navigation`), FAB, icons |
| `@react-native-vector-icons/material-design-icons` | Tab icons, drawer icons, header icons                                               |
| `react-native-gesture-handler`                     | Required by navigation/drawer                                                       |
| `react-native-reanimated`                          | Required by drawer animations                                                       |
| `react-native-screens`                             | Required by native-stack                                                            |
| `react-native-safe-area-context`                   | Required by navigation                                                              |
| `react-native-svg`                                 | Required by Paper/icons                                                             |
| `react-native-pager-view`                          | Required by material-top-tabs                                                       |
| `react-native-tab-view`                            | Required by material-top-tabs                                                       |
| `react-native-config`                              | `E2E_MODE` flag for disabling animations in tests                                   |
| `react-native-mmkv`                                | Navigation state persistence (dev)                                                  |
| `react-native-bootsplash`                          | Splash screen during state restore                                                  |
| `i18next`, `react-i18next`                         | UI strings for permanent components (tabs, drawer, auth)                            |
| `@whitewater-guide/translations`                   | Translation files                                                                   |
| `detox` (dev)                                      | E2E testing                                                                         |

### Not needed until later phases

These are installed but unused in Phase 4. No action needed — they don't affect builds negatively.

- `@rnmapbox/maps` — Phase 5 (maps)
- `@shopify/flash-list` — real list screens
- `@gorhom/bottom-sheet` — detail screens
- `@expo/react-native-action-sheet` — context menus
- `@react-native-community/datetimepicker` — descent form
- `@react-native-community/netinfo` — offline handling
- `@react-native-clipboard/clipboard` — share features
- `@ronradtke/react-native-markdown-display` — content rendering
- `react-native-image-picker` — photo features
- `react-native-keyboard-controller` — form screens
- `react-native-sensitive-info` — secure auth storage
- `react-native-device-info` — analytics/support
- `react-native-linear-gradient` — UI styling
- `react-native-webview` — WEB_VIEW screen (placeholder for now)
- `@whitewater-guide/clients`, `schema`, `commons`, `validation` — GraphQL/data layer
- `date-fns`, `date-fns-tz`, `pretty-bytes`, `intl-pluralrules` — data formatting

### Review candidates

| Package                                 | Question                                                                                                                                                |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@react-navigation/bottom-tabs`         | Probably not needed — region/section tabs use Paper's material bottom tabs, add-section uses material-top-tabs. Remove unless a use case is identified. |
| `@react-native-masked-view/masked-view` | Was required by `@react-navigation/stack` (JS-based). We use `native-stack` instead. Check if anything else needs it — if not, remove.                  |
| `react-native-nitro-modules`            | Experimental RN module system. Verify if any dep requires it — if not, remove.                                                                          |
| `react-native-worklets`                 | May be required by reanimated v4. Verify — if not a transitive requirement, remove.                                                                     |

---

## 4.2 — Set up React Native Paper theme

- Port theme from old app (`src/theme/`): colors, spacing, typography
- Configure `PaperProvider` with MD3 theme (upgrade from MD2)
- Port `Icon` component wrapper for `@react-native-vector-icons/material-design-icons`

---

## 4.3 — Define screen names & navigation types

### Screens enum

Port from old app, **dropping all chat-related screens** (`CHAT`, `REGION_FAKE_CHAT`, `SECTION_FAKE_CHAT`):

```typescript
export enum Screens {
  ROOT_STACK = 'ROOT_STACK',

  REGIONS_LIST = 'REGIONS_LIST',

  REGION_STACK = 'REGION_STACK',
  REGION_TABS = 'REGION_TABS',
  REGION_MAP = 'REGION_MAP',
  REGION_SECTIONS_LIST = 'REGION_SECTIONS_LIST',
  REGION_INFO = 'REGION_INFO',

  SECTION_SCREEN = 'SECTION_SCREEN',
  SECTION_MAP = 'SECTION_MAP',
  SECTION_CHART = 'SECTION_CHART',
  SECTION_INFO = 'SECTION_INFO',
  SECTION_MEDIA = 'SECTION_MEDIA',

  FILTER = 'FILTER',

  ADD_SECTION_SCREEN = 'ADD_SECTION_SCREEN',
  ADD_SECTION_TABS = 'ADD_SECTION_TABS',
  ADD_SECTION_MAIN = 'ADD_SECTION_MAIN',
  ADD_SECTION_ATTRIBUTES = 'ADD_SECTION_ATTRIBUTES',
  ADD_SECTION_DESCRIPTION = 'ADD_SECTION_DESCRIPTION',
  ADD_SECTION_FLOWS = 'ADD_SECTION_FLOWS',
  ADD_SECTION_PHOTOS = 'ADD_SECTION_PHOTOS',
  ADD_SECTION_RIVER = 'ADD_SECTION_RIVER',
  ADD_SECTION_GAUGE = 'ADD_SECTION_GAUGE',
  ADD_SECTION_SHAPE = 'ADD_SECTION_SHAPE',
  ADD_SECTION_PHOTO = 'ADD_SECTION_PHOTO',

  AUTH_STACK = 'AUTH_STACK',
  AUTH_MAIN = 'AUTH_MAIN',
  AUTH_SIGN_IN = 'AUTH_SIGN_IN',
  AUTH_REGISTER = 'AUTH_REGISTER',
  AUTH_FORGOT = 'AUTH_FORGOT',
  AUTH_RESET = 'AUTH_RESET',
  AUTH_SOCIAL = 'AUTH_SOCIAL',
  AUTH_WELCOME = 'AUTH_WELCOME',

  MY_PROFILE = 'MY_PROFILE',
  CONNECT_EMAIL_REQUEST = 'CONNECT_EMAIL_REQUEST',
  CONNECT_EMAIL = 'CONNECT_EMAIL',
  CONNECT_EMAIL_SUCCESS = 'CONNECT_EMAIL_SUCCESS',

  LOGBOOK = 'LOGBOOK',
  DESCENT = 'DESCENT',
  DESCENT_FORM = 'DESCENT_FORM',
  DESCENT_FORM_SECTION = 'DESCENT_FORM_SECTION',
  DESCENT_FORM_DATE = 'DESCENT_FORM_DATE',
  DESCENT_FORM_LEVEL = 'DESCENT_FORM_LEVEL',
  DESCENT_FORM_COMMENT = 'DESCENT_FORM_COMMENT',

  PLAIN = 'PLAIN',
  LICENSE = 'LICENSE',
  WEB_VIEW = 'WEB_VIEW',
  SUGGESTION = 'SUGGESTION',
}
```

### Navigation param types

Port from old app's `navigation-params.ts`. Key params:

- `REGION_STACK`: `{ regionId: string }`
- `SECTION_SCREEN`: `{ sectionId: string }`
- `DESCENT`: `{ descentId: string }`
- `DESCENT_FORM`: `{ regionId?: string; descentId?: string; formData?: Partial<DescentFormData> }`
- `ADD_SECTION_SCREEN`: `{ fromDescentFormKey?: string }` (region data omitted at this stage)
- `PLAIN`: `{ title?: string; text?: string | null }`
- `WEB_VIEW`: `{ fixture?: string; title?: string }`
- `LICENSE`: `{ placement: string; license: unknown; copyright?: string | null }`
- `SUGGESTION`: `{ sectionId: string }`

### Files to create

| File                                       | Purpose                                |
| ------------------------------------------ | -------------------------------------- |
| `src/core/navigation/screen-names.ts`      | `Screens` enum                         |
| `src/core/navigation/navigation-params.ts` | TypeScript param types for all screens |

---

## 4.4 — Mock screen strategy

Screens in this phase fall into two categories: **mock screens** with hardcoded navigation buttons, and **placeholder screens** with no interaction. All screens must be E2E-testable.

### testID conventions

Every interactive element gets a `testID` for Detox:

| Element type        | testID pattern           | Example                              | Permanent? |
| ------------------- | ------------------------ | ------------------------------------ | ---------- |
| Screen wrapper      | `screen:{ScreenName}`    | `screen:REGIONS_LIST`                | Yes        |
| Drawer items        | `drawer:{item}`          | `drawer:regions`, `drawer:logbook`   | Yes        |
| Tab bar tabs        | `tab:{TabName}`          | `tab:REGION_MAP`, `tab:SECTION_INFO` | Yes        |
| Header back         | `header:back`            |                                      | Yes        |
| Header menu         | `header:menu`            |                                      | Yes        |
| Header right action | `header:right:{action}`  | `header:right:filter`                | Semi       |
| FAB main            | `fab:main`               |                                      | Yes        |
| FAB actions         | `fab:{action}`           | `fab:add-descent`                    | Yes        |
| Mock nav buttons    | `mock:navigate:{target}` | `mock:navigate:REGION_STACK`         | Temporary  |
| Auth form buttons   | `auth:{action}`          | `auth:sign-in`, `auth:register`      | Yes        |

### Mock screens (temporary — will be fully replaced)

These screens exist only to enable navigation testing. They show the screen name, received params, and buttons to trigger outgoing navigation transitions. Each mock screen covers all the click-based transitions documented in the navigation map.

| Screen                         | Mock content                                                                                                          |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `MockRegionsListScreen`        | Button "Region XXX" → `REGION_STACK(regionId: "xxx")`                                                                 |
| `MockRegionMapScreen`          | Button "Section YYY" → `SECTION_SCREEN(sectionId: "yyy")`                                                             |
| `MockRegionSectionsListScreen` | Button "Section YYY" → `SECTION_SCREEN(sectionId: "yyy")`, button "Filter" → `FILTER`                                 |
| `MockRegionInfoScreen`         | Menu buttons: "Web View" → `WEB_VIEW`, "License" → `LICENSE`, "Plain" → `PLAIN`                                       |
| `MockSectionInfoScreen`        | Menu buttons: "Web View" → `WEB_VIEW`, "License" → `LICENSE`, "Plain" → `PLAIN`, "Region" → `REGION_STACK`            |
| `MockLogbookScreen`            | Button "Descent ZZZ" → `DESCENT(descentId: "zzz")`                                                                    |
| `MockDescentScreen`            | Buttons "Edit" → `DESCENT_FORM(descentId: "zzz")`, "Duplicate" → `DESCENT_FORM(formData: ...)`                        |
| `MockDescentFormSectionScreen` | Button "Add New Section" → `ADD_SECTION_SCREEN(fromDescentFormKey: ...)`, "Next" → `DESCENT_FORM_DATE`                |
| `MockDescentFormDateScreen`    | "Next" → `DESCENT_FORM_LEVEL`, "Back"                                                                                 |
| `MockDescentFormLevelScreen`   | "Next" → `DESCENT_FORM_COMMENT`, "Back"                                                                               |
| `MockDescentFormCommentScreen` | "Submit" (shows alert, goes back to start), "Back"                                                                    |
| `MockAddSectionTabScreens`     | Each tab shows its name. "River" / "Gauge" / "Shape" / "Photo" buttons → sub-screens. "Submit" button on tabs header. |

### Placeholder screens (generic — no navigation)

A single reusable `PlaceholderScreen` component that displays:

- Screen name (from route)
- Received params (JSON-formatted)
- `testID="screen:{ScreenName}"`

Used for: `REGION_MAP` (if no nav buttons needed beyond mock), `SECTION_MAP`, `SECTION_CHART`, `SECTION_MEDIA`, `PLAIN`, `WEB_VIEW`, `LICENSE`, `FILTER`, `SUGGESTION`, `MY_PROFILE`, `CONNECT_EMAIL_*`.

### Semi-permanent components (structure stays, content evolves)

These components will keep their navigation structure and testIDs — only inner content changes later:

- **DrawerSidebar** — menu items, auth gating, icons
- **Region/Section tab bars** — tab labels, icons, tab count
- **Auth screen buttons** — sign-in/register/forgot navigation buttons
- **Header** — back/menu button, title area
- **RegionFAB / SectionFAB** — FAB with action items

---

## 4.5 — Build navigation skeleton

### Full navigation tree (no chat)

```
RootDrawer (id: "Drawer")
├── DrawerSidebar
│   ├── My Profile → MY_PROFILE (auth-gated)
│   ├── Sign In → AUTH_STACK (shown when logged out)
│   ├── Regions → reset to REGIONS_LIST
│   ├── Logbook → LOGBOOK (auth-gated, else → AUTH_STACK)
│   ├── FAQ → WEB_VIEW(fixture: "faq")
│   ├── Backers → WEB_VIEW(fixture: "backers")
│   ├── Terms → WEB_VIEW(fixture: "terms_and_conditions")
│   └── Privacy → WEB_VIEW(fixture: "privacy_policy")
└── RootStack (id: "RootStack")
    ├── REGIONS_LIST → MockRegionsListScreen
    ├── REGION_STACK (nested stack, id: "RegionStack")
    │   ├── REGION_TABS (Paper material bottom tabs)
    │   │   ├── REGION_MAP → MockRegionMapScreen
    │   │   ├── REGION_SECTIONS_LIST → MockRegionSectionsListScreen
    │   │   └── REGION_INFO → MockRegionInfoScreen
    │   └── FILTER → PlaceholderScreen
    ├── SECTION_SCREEN (nested stack, id: "SectionStack")
    │   └── SECTION_TABS (Paper material bottom tabs)
    │       ├── SECTION_MAP → PlaceholderScreen
    │       ├── SECTION_CHART → PlaceholderScreen (conditionally shown — always show in mock)
    │       ├── SECTION_INFO → MockSectionInfoScreen
    │       └── SECTION_MEDIA → PlaceholderScreen
    ├── AUTH_STACK (nested native-stack)
    │   ├── AUTH_MAIN → MockAuthMainScreen
    │   ├── AUTH_SIGN_IN → MockAuthSignInScreen
    │   ├── AUTH_REGISTER → MockAuthRegisterScreen
    │   ├── AUTH_FORGOT → MockAuthForgotScreen
    │   ├── AUTH_RESET → PlaceholderScreen
    │   ├── AUTH_SOCIAL → PlaceholderScreen
    │   └── AUTH_WELCOME → PlaceholderScreen
    ├── DESCENT_FORM (nested native-stack)
    │   ├── DESCENT_FORM_SECTION → MockDescentFormSectionScreen
    │   ├── DESCENT_FORM_DATE → MockDescentFormDateScreen
    │   ├── DESCENT_FORM_LEVEL → MockDescentFormLevelScreen
    │   └── DESCENT_FORM_COMMENT → MockDescentFormCommentScreen
    ├── ADD_SECTION_SCREEN (nested native-stack)
    │   ├── ADD_SECTION_TABS (material-top-tabs, positioned bottom)
    │   │   ├── ADD_SECTION_MAIN
    │   │   ├── ADD_SECTION_ATTRIBUTES
    │   │   ├── ADD_SECTION_DESCRIPTION
    │   │   ├── ADD_SECTION_FLOWS
    │   │   └── ADD_SECTION_PHOTOS
    │   ├── ADD_SECTION_RIVER → PlaceholderScreen
    │   ├── ADD_SECTION_GAUGE → PlaceholderScreen
    │   ├── ADD_SECTION_SHAPE → PlaceholderScreen
    │   └── ADD_SECTION_PHOTO → PlaceholderScreen
    ├── LOGBOOK → MockLogbookScreen
    ├── DESCENT → MockDescentScreen
    ├── MY_PROFILE → PlaceholderScreen
    ├── CONNECT_EMAIL_REQUEST → PlaceholderScreen
    ├── CONNECT_EMAIL → PlaceholderScreen
    ├── CONNECT_EMAIL_SUCCESS → PlaceholderScreen
    ├── PLAIN → PlaceholderScreen
    ├── WEB_VIEW → PlaceholderScreen
    ├── LICENSE → PlaceholderScreen
    └── SUGGESTION → PlaceholderScreen
```

### Key react-navigation v7 implementation notes

- Use **dynamic API** (not static) — required for conditional tab visibility (SECTION_CHART)
- Assign `id` props to navigators: `"Drawer"`, `"RootStack"`, `"RegionStack"`, `"SectionStack"` — enables typed `getParent('id')` calls
- Replace `animationEnabled` with `animation: process.env.E2E_MODE === 'true' ? 'none' : 'default'`
- `gestureEnabled: false` globally on all stacks (unchanged from v6)
- `navigate` in v7 always pushes — use `popTo` where the old app relied on `navigate` going back to an existing screen
- Material bottom tabs: `createMaterialBottomTabNavigator` from `react-native-paper/react-navigation`
- Material top tabs: `createMaterialTopTabNavigator` from `@react-navigation/material-top-tabs` (for AddSectionTabs, positioned at bottom with `tabBarPosition: "bottom"`)
- Tab screens modify parent header via `useFocusEffect` + `navigation.getParent('id')?.setOptions(...)` — port this pattern even in mock phase for header-right content

### RegionFAB & SectionFAB

Implement as Paper `FAB.Group` components overlaid on tab screens. They are semi-permanent (structure stays):

**RegionFAB actions:**

- "Add Section" → `ADD_SECTION_SCREEN`
- "Add Descent" → `DESCENT_FORM` (with pre-built internal state, see research §2.4)

**SectionFAB actions:**

- "Add Suggestion" → `SUGGESTION(sectionId: "yyy")`
- "Add Descent" → `DESCENT_FORM` (dispatched on parent, see research §2.4)

### Files to create

| File                                            | Purpose                                                | Permanent? |
| ----------------------------------------------- | ------------------------------------------------------ | ---------- |
| `src/core/navigation/screen-names.ts`           | `Screens` enum                                         | Yes        |
| `src/core/navigation/navigation-params.ts`      | TypeScript param types for all screens                 | Yes        |
| `src/core/navigation/RootStack.tsx`             | Main stack navigator with all screen registrations     | Yes        |
| `src/core/navigation/RootDrawer.tsx`            | Drawer navigator wrapper                               | Yes        |
| `src/core/navigation/NavigationRoot.tsx`        | Navigation container with linking config + persistence | Yes        |
| `src/core/navigation/DrawerSidebar.tsx`         | Drawer content with menu items                         | Yes        |
| `src/core/navigation/useLinking.ts`             | Deep linking configuration                             | Yes        |
| `src/core/navigation/usePersistence.ts`         | Navigation state persistence (dev only)                | Yes        |
| `src/core/navigation/useSignOut.ts`             | Navigation reset + cache cleanup on sign-out           | Yes        |
| `src/components/PlaceholderScreen.tsx`          | Reusable placeholder showing screen name + params      | Temporary  |
| `src/components/header/Header.tsx`              | Custom header component                                | Yes        |
| `src/components/header/HeaderLeft.tsx`          | Back/menu button                                       | Yes        |
| `src/components/header/HeaderCenter.tsx`        | Title area                                             | Yes        |
| `src/components/header/HeaderRight.tsx`         | Action button slot                                     | Yes        |
| `src/components/header/getHeaderRenderer.tsx`   | Header factory (isTopLevel flag)                       | Yes        |
| `src/screens/region/RegionStack.tsx`            | Region stack with tabs + FILTER                        | Yes        |
| `src/screens/region/RegionTabs.tsx`             | Material bottom tabs (3 tabs, no chat)                 | Yes        |
| `src/screens/region/RegionFAB.tsx`              | FAB overlay on region tabs                             | Yes        |
| `src/screens/section/SectionTabs.tsx`           | Material bottom tabs (4 tabs, no chat)                 | Yes        |
| `src/screens/section/SectionFAB.tsx`            | FAB overlay on section tabs                            | Yes        |
| `src/screens/auth/AuthStack.tsx`                | Auth nested stack                                      | Yes        |
| `src/screens/descent-form/DescentFormStack.tsx` | Descent form wizard stack                              | Yes        |
| `src/screens/add-section/AddSectionStack.tsx`   | Add section stack + tabs                               | Yes        |
| `src/screens/add-section/AddSectionTabs.tsx`    | Material top tabs (5 tabs)                             | Yes        |
| `src/screens/mock/*.tsx`                        | All mock screens (temporary)                           | No         |

---

## 4.6 — Build header component

Port the custom header from old app:

- `getHeaderRenderer(isTopLevel: boolean)` factory — returns `header` option for navigators
- **HeaderLeft**: shows menu button (opens drawer) for top-level screens, back button for others
- **HeaderCenter**: title text or custom title component (RegionTitle, SectionTitle — placeholder versions)
- **HeaderRight**: slot for action buttons (populated by tab screens via `useFocusEffect`)
- **Search mode**: placeholder for now — the header supports toggling between normal and search mode, but search functionality is deferred. Wire up the mode toggle so the UI transition can be tested.
- **Drawer access**: use `navigation.getParent<DrawerNavigationProp>('Drawer').openDrawer()` (typed, no `as any` hack)

---

## 4.7 — Set up deep linking

### Phase 4 scope

Configure the declarative `linking` prop on `NavigationContainer` (v7 improved API) rather than the old app's manual URL parsing approach.

### Deep link routes

| URL pattern                 | Screen                    | Params          |
| --------------------------- | ------------------------- | --------------- |
| `/auth/reset/:token`        | `AUTH_STACK > AUTH_RESET` | `{ token }`     |
| `/auth/verify-email/:token` | `CONNECT_EMAIL`           | `{ token }`     |
| `/region/:regionId`         | `REGION_STACK`            | `{ regionId }`  |
| `/section/:sectionId`       | `SECTION_SCREEN`          | `{ sectionId }` |

### Native configuration (already in place)

Native deep linking is fully configured on both platforms:

**iOS:**

- `AppDelegate.swift` handles incoming URLs via `RCTLinkingManager.application(_:open:options:)` and universal links via `RCTLinkingManager.application(_:continue:restorationHandler:)`
- `whitewater.entitlements` has Associated Domains configured: `applinks:whitewater.guide`, `applinks:app.whitewater.guide`, `applinks:whitewater-dev.com`, `applinks:app.whitewater-dev.com`

**Android:**

- `AndroidManifest.xml` has an intent-filter on `MainActivity` with `android:autoVerify="true"`, scheme and host sourced from `react-native-config` (`BACKEND_PROTOCOL` / `DEEP_LINKING_DOMAIN`)

**Environment config:**

- `.env`, `.env.staging`, `.env.production` all define `BACKEND_PROTOCOL=https` and `DEEP_LINKING_DOMAIN=app.whitewater.guide`

### JS-side linking config

What remains is wiring the `linking` prop on `NavigationContainer` to map incoming URLs to screens. Use the react-navigation v7 declarative linking config:

```typescript
const linking = {
  prefixes: [
    `${Config.BACKEND_PROTOCOL}://${Config.DEEP_LINKING_DOMAIN}`,
    `${Config.BACKEND_PROTOCOL}://whitewater.guide`,
  ],
  config: {
    screens: {
      [Screens.AUTH_STACK]: {
        screens: {
          [Screens.AUTH_RESET]: 'auth/reset/:token',
        },
      },
      [Screens.CONNECT_EMAIL]: 'auth/verify-email/:token',
      [Screens.REGION_STACK]: 'region/:regionId',
      [Screens.SECTION_SCREEN]: 'section/:sectionId',
    },
  },
};
```

Test with `npx uri-scheme open` or Detox deep link APIs.

---

## 4.8 — Navigation state persistence

Port `usePersistence` hook:

- Save navigation state to MMKV on every `onStateChange`
- Restore on app launch, show splash screen while loading
- **E2E mode**: when `process.env.E2E_MODE === 'true'`, skip persistence entirely — always start fresh
- Key: `'wwguide2_nav_state'`

---

## 4.9 — E2E tests: navigation without auth

Detox E2E coverage of click-based navigation transitions that do **not** require mock auth state. **No gesture-based transitions** (swipe to open drawer, back swipe, tab swipe).

### Test structure

```
e2e/
├── navigation/
│   ├── drawer.test.ts          — Drawer menu navigation (non-auth items)
│   ├── regionTabs.test.ts      — Region tab switching + outgoing (no FAB)
│   ├── sectionTabs.test.ts     — Section tab switching + outgoing (no FAB)
│   ├── authStack.test.ts       — Auth flow navigation
│   ├── descentForm.test.ts     — Descent form wizard navigation
│   ├── addSection.test.ts      — Add section tabs + sub-screens
│   ├── deepLinking.test.ts     — Deep link URL handling
│   └── backNavigation.test.ts  — Header back button throughout
├── helpers/
│   └── navigation.ts           — Helpers: expectScreen, tapDrawerItem, etc.
└── setup.ts                    — Global Detox setup
```

### Test helper conventions

```typescript
// Assert current screen by checking testID
async function expectScreen(screenName: string) {
  await expect(element(by.id(`screen:${screenName}`))).toBeVisible();
}

// Tap a drawer menu item
async function tapDrawerItem(item: string) {
  await element(by.id('header:menu')).tap();
  await element(by.id(`drawer:${item}`)).tap();
}
```

### Transitions to cover

#### Drawer navigation (`drawer.test.ts`)

| #   | Action                             | Expected screen                            |
| --- | ---------------------------------- | ------------------------------------------ |
| 1   | Open drawer via header menu button | Drawer visible                             |
| 2   | Drawer → "Regions"                 | `REGIONS_LIST` (reset)                     |
| 3   | Drawer → "FAQ"                     | `WEB_VIEW` (fixture: faq)                  |
| 4   | Drawer → "Backers"                 | `WEB_VIEW` (fixture: backers)              |
| 5   | Drawer → "Terms of Service"        | `WEB_VIEW` (fixture: terms_and_conditions) |
| 6   | Drawer → "Privacy Policy"          | `WEB_VIEW` (fixture: privacy_policy)       |

#### Region tabs (`regionTabs.test.ts`)

| #   | Precondition            | Action                  | Expected                              |
| --- | ----------------------- | ----------------------- | ------------------------------------- |
| 1   | At REGIONS_LIST         | Tap "Region XXX" button | `REGION_TABS` visible, map tab active |
| 2   | At REGION_TABS          | Tap sections tab        | `REGION_SECTIONS_LIST` visible        |
| 3   | At REGION_TABS          | Tap info tab            | `REGION_INFO` visible                 |
| 4   | At REGION_TABS          | Tap map tab             | `REGION_MAP` visible                  |
| 5   | At REGION_MAP           | Tap "Section YYY"       | `SECTION_SCREEN`                      |
| 6   | At REGION_SECTIONS_LIST | Tap "Section YYY"       | `SECTION_SCREEN`                      |
| 7   | At REGION_SECTIONS_LIST | Tap "Filter"            | `FILTER` screen                       |
| 8   | At REGION_INFO          | Tap "Web View"          | `WEB_VIEW`                            |
| 9   | At REGION_INFO          | Tap "License"           | `LICENSE`                             |
| 10  | At REGION_INFO          | Tap "Plain"             | `PLAIN`                               |

#### Section tabs (`sectionTabs.test.ts`)

| #   | Precondition      | Action                     | Expected                |
| --- | ----------------- | -------------------------- | ----------------------- |
| 1   | At SECTION_SCREEN | Verify info tab is initial | `SECTION_INFO` visible  |
| 2   | At SECTION_TABS   | Tap map tab                | `SECTION_MAP` visible   |
| 3   | At SECTION_TABS   | Tap chart tab              | `SECTION_CHART` visible |
| 4   | At SECTION_TABS   | Tap media tab              | `SECTION_MEDIA` visible |
| 5   | At SECTION_INFO   | Tap "Web View"             | `WEB_VIEW`              |
| 6   | At SECTION_INFO   | Tap "License"              | `LICENSE`               |
| 7   | At SECTION_INFO   | Tap "Plain"                | `PLAIN`                 |
| 8   | At SECTION_INFO   | Tap "Region"               | `REGION_STACK`          |

#### Auth stack (`authStack.test.ts`)

| #   | Action                                 | Expected                |
| --- | -------------------------------------- | ----------------------- |
| 1   | Navigate to AUTH_STACK                 | `AUTH_MAIN` visible     |
| 2   | Tap "Sign In"                          | `AUTH_SIGN_IN` visible  |
| 3   | Back                                   | `AUTH_MAIN`             |
| 4   | Tap "Register"                         | `AUTH_REGISTER` visible |
| 5   | Back                                   | `AUTH_MAIN`             |
| 6   | At AUTH_SIGN_IN, tap "Forgot Password" | `AUTH_FORGOT` visible   |
| 7   | Back                                   | `AUTH_SIGN_IN`          |
| 8   | Auth close (parent goBack)             | Previous screen         |

#### Descent form wizard (`descentForm.test.ts`)

| #   | Action                                         | Expected                            |
| --- | ---------------------------------------------- | ----------------------------------- |
| 1   | Navigate to DESCENT_FORM                       | `DESCENT_FORM_SECTION` (first step) |
| 2   | Tap "Next"                                     | `DESCENT_FORM_DATE`                 |
| 3   | Tap "Next"                                     | `DESCENT_FORM_LEVEL`                |
| 4   | Tap "Next"                                     | `DESCENT_FORM_COMMENT`              |
| 5   | Tap "Submit"                                   | Returns to previous screen          |
| 6   | At DESCENT_FORM_SECTION, tap "Add New Section" | `ADD_SECTION_SCREEN`                |
| 7   | Back from ADD_SECTION_SCREEN                   | `DESCENT_FORM_SECTION`              |

#### Add section (`addSection.test.ts`)

| #   | Action                         | Expected                                 |
| --- | ------------------------------ | ---------------------------------------- |
| 1   | Navigate to ADD_SECTION_SCREEN | `ADD_SECTION_TABS` with main tab visible |
| 2   | Tap attributes tab             | `ADD_SECTION_ATTRIBUTES` visible         |
| 3   | Tap description tab            | `ADD_SECTION_DESCRIPTION` visible        |
| 4   | Tap flows tab                  | `ADD_SECTION_FLOWS` visible              |
| 5   | Tap photos tab                 | `ADD_SECTION_PHOTOS` visible             |
| 6   | Tap main tab (back)            | `ADD_SECTION_MAIN` visible               |
| 7   | Navigate to ADD_SECTION_RIVER  | `ADD_SECTION_RIVER` visible              |
| 8   | Back                           | `ADD_SECTION_TABS`                       |
| 9   | Navigate to ADD_SECTION_GAUGE  | `ADD_SECTION_GAUGE` visible              |
| 10  | Navigate to ADD_SECTION_SHAPE  | `ADD_SECTION_SHAPE` visible              |
| 11  | Navigate to ADD_SECTION_PHOTO  | `ADD_SECTION_PHOTO` visible              |

#### Deep linking (`deepLinking.test.ts`)

| #   | URL                    | Expected                              |
| --- | ---------------------- | ------------------------------------- |
| 1   | `/region/xxx`          | `REGION_STACK` with regionId "xxx"    |
| 2   | `/section/yyy`         | `SECTION_SCREEN` with sectionId "yyy" |
| 3   | `/auth/reset/token123` | `AUTH_RESET` screen                   |

#### Back navigation (`backNavigation.test.ts`)

| #   | Scenario                  | Action      | Expected                      |
| --- | ------------------------- | ----------- | ----------------------------- |
| 1   | At REGION_STACK           | Header back | `REGIONS_LIST`                |
| 2   | At SECTION_SCREEN         | Header back | Previous screen (REGION_TABS) |
| 3   | At WEB_VIEW (from drawer) | Header back | Previous screen               |
| 4   | At FILTER                 | Header back | `REGION_TABS`                 |
| 5   | At nested form step       | Header back | Previous step                 |

---

## 4.10 — E2E tests: mock auth and auth-gated flows

### Mock auth context

Implement a simple boolean toggle (React context + MMKV flag) to simulate logged-in / logged-out state. The drawer items and FAB actions respect this flag:

- **Logged out**: drawer shows "Sign In", "Logbook" goes to AUTH_STACK
- **Logged in**: drawer shows "My Profile", "Logbook" goes to LOGBOOK

A dev-only toggle button (or a special testID element) lets E2E tests switch auth state.

#### Files to create

| File                            | Purpose                                   | Permanent? |
| ------------------------------- | ----------------------------------------- | ---------- |
| `src/core/auth/AuthContext.tsx` | Mock auth context (simple boolean toggle) | Evolves    |

### Test structure

```
e2e/
├── navigation/
│   ├── drawerAuth.test.ts       — Auth-gated drawer items
│   ├── fab.test.ts              — FAB actions (auth-gated)
│   └── logbookDescent.test.ts   — Logbook → Descent → Form flows
├── helpers/
│   └── auth.ts                  — Toggle mock auth state
```

### Transitions to cover

#### Auth-gated drawer navigation (`drawerAuth.test.ts`)

| #   | Auth state | Action                | Expected screen |
| --- | ---------- | --------------------- | --------------- |
| 1   | Logged out | Drawer → "Sign In"    | `AUTH_MAIN`     |
| 2   | Logged out | Drawer → "Logbook"    | `AUTH_MAIN`     |
| 3   | Logged in  | Drawer → "My Profile" | `MY_PROFILE`    |
| 4   | Logged in  | Drawer → "Logbook"    | `LOGBOOK`       |

#### FAB actions (`fab.test.ts`)

| #   | Precondition    | Action                 | Expected             |
| --- | --------------- | ---------------------- | -------------------- |
| 1   | At REGION_TABS  | FAB → "Add Section"    | `ADD_SECTION_SCREEN` |
| 2   | At REGION_TABS  | FAB → "Add Descent"    | `DESCENT_FORM`       |
| 3   | At SECTION_TABS | FAB → "Add Suggestion" | `SUGGESTION`         |
| 4   | At SECTION_TABS | FAB → "Add Descent"    | `DESCENT_FORM`       |

#### Logbook → Descent flows (`logbookDescent.test.ts`)

| #   | Action                       | Expected                      |
| --- | ---------------------------- | ----------------------------- |
| 1   | Drawer → Logbook (logged in) | `LOGBOOK` visible             |
| 2   | Tap "Descent ZZZ"            | `DESCENT` visible             |
| 3   | Tap "Edit"                   | `DESCENT_FORM` with form data |
| 4   | Back to DESCENT              | `DESCENT` visible             |
| 5   | Tap "Duplicate"              | `DESCENT_FORM` with form data |

---

## 4.11 — Validation

- [ ] App launches and shows REGIONS_LIST with drawer accessible via header menu button
- [ ] Can navigate between all screens via mock buttons and drawer items
- [ ] Region tabs: 3 tabs (map, sections, info) switch correctly
- [ ] Section tabs: 4 tabs (map, chart, info, media) switch correctly
- [ ] AddSection tabs: 5 scrollable top tabs switch correctly
- [ ] Header renders correctly with back button (inner screens) / menu button (top-level)
- [ ] Auth gating works: drawer items change based on mock auth state
- [ ] FABs on region and section screens trigger correct navigation
- [ ] Descent form wizard: all 4 steps navigate in sequence
- [ ] Deep links resolve to correct screens
- [ ] Navigation state persists across reloads (dev mode only)
- [ ] E2E mode: animations disabled, persistence skipped, fresh start
- [ ] Both iOS simulator and Android emulator show identical behavior
- [ ] **Storybook:** PlaceholderScreen story, Header story, DrawerSidebar story
- [ ] **Detox E2E:** All transitions from §4.9 and §4.10 pass on both platforms
