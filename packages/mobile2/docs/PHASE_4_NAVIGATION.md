# Phase 4: Core Navigation Shell

**Goal:** App has the full navigation skeleton with placeholder screens, drawer sidebar, and deep linking.

---

## 4.1 — Navigation dependencies

All navigation and UI framework deps are already installed and build-verified from Phase 3:

- `@react-navigation/*` v7, `react-native-screens` v4, `react-native-safe-area-context` v5
- `react-native-gesture-handler` v2, `react-native-reanimated` v4
- `react-native-paper` v5.15, `react-native-vector-icons`, `react-native-svg` v15

No additional installs needed — proceed directly to configuration.

## 4.2 — Set up React Native Paper theme

- Port theme from old app (`src/theme/`): colors, spacing, typography
- Configure `PaperProvider` with MD3 theme (upgrade from MD2)
- Port `Icon` component wrapper

## 4.3 — Build navigation skeleton

Port the full navigation structure with placeholder screens:

```
RootDrawer
├── DrawerSidebar (logo, menu items — placeholder actions)
└── RootStack
    ├── REGIONS_LIST → PlaceholderScreen
    ├── REGION_STACK
    │   └── REGION_TABS (map | sections | info)
    │       ├── map → PlaceholderScreen (map added in Phase 5)
    │       ├── sections → PlaceholderScreen
    │       └── info → PlaceholderScreen
    ├── SECTION_SCREEN
    │   └── SECTION_TABS (map | chart | info | media)
    ├── AUTH_STACK (sign-in | register | forgot | reset)
    ├── LOGBOOK → PlaceholderScreen
    ├── DESCENT → PlaceholderScreen
    ├── DESCENT_FORM_STACK
    ├── ADD_SECTION_SCREEN
    ├── MY_PROFILE → PlaceholderScreen
    ├── PLAIN → PlaceholderScreen
    ├── WEB_VIEW → PlaceholderScreen
    ├── LICENSE → PlaceholderScreen
    ├── SUGGESTION → PlaceholderScreen
    └── CHAT → PlaceholderScreen (last to implement)
```

### Key react-navigation 7 changes from v6

- Screen config moves from `options` object to `<Screen>` component props
- `screenListeners` API changed
- Group component for shared config
- Static API available (optional, can use dynamic API)
- `@react-navigation/material-bottom-tabs` is removed — use react-native-paper's `BottomNavigation` integrated with react-navigation via `createMaterialBottomTabNavigator` from `react-native-paper/react-navigation`
- `useLinkTo` / `useNavigation` API largely unchanged

### Files to create

| File                                       | Purpose                                            |
| ------------------------------------------ | -------------------------------------------------- |
| `src/core/navigation/screen-names.ts`      | `Screens` enum (port from old app)                 |
| `src/core/navigation/navigation-params.ts` | TypeScript param types for all screens             |
| `src/core/navigation/RootStack.tsx`        | Main stack navigator with all screen registrations |
| `src/core/navigation/RootDrawer.tsx`       | Drawer navigator wrapper                           |
| `src/core/navigation/NavigationRoot.tsx`   | Navigation container with linking config           |
| `src/core/navigation/DrawerSidebar.tsx`    | Drawer content with menu items                     |
| `src/core/navigation/useLinking.ts`        | Deep linking configuration                         |
| `src/core/navigation/usePersistence.ts`    | Navigation state persistence (dev only)            |
| `src/components/PlaceholderScreen.tsx`     | Reusable placeholder showing screen name           |

## 4.4 — Set up deep linking configuration

- Configure navigation linking for auth callbacks and content URLs
- Domains: `whitewater.guide`, `app.whitewater.guide`
- Android: App Links with `autoVerify` in `AndroidManifest.xml`
- iOS: Associated Domains entitlement in Xcode

### Deep link routes to configure

| URL pattern                 | Screen         |
| --------------------------- | -------------- |
| `/auth/reset/:token`        | AUTH_RESET     |
| `/auth/verify-email/:token` | CONNECT_EMAIL  |
| `/region/:regionId`         | REGION_STACK   |
| `/section/:sectionId`       | SECTION_SCREEN |

## 4.5 — Build header component

Port the custom header used across all screens:

- `Header.tsx` — Main header component
- `HeaderLeft` (back/menu button), `HeaderCenter` (title), `HeaderRight` (action buttons)
- Search integration (for section filtering — placeholder for now)

## 4.6 — Validation

- [ ] App launches and shows navigation drawer
- [ ] Can navigate between all placeholder screens via drawer
- [ ] Tab navigators (region tabs, section tabs) switch between tabs
- [ ] Header renders correctly with back/menu button
- [ ] Deep links open correct screens (test with `adb shell am start` / `xcrun simctl openurl`)
- [ ] Navigation state persists across reloads (dev mode)
- [ ] Both iOS simulator and Android emulator show identical behavior
- [ ] **Unit tests:** Navigation structure renders without crashing
- [ ] **Storybook:** PlaceholderScreen story, Header story, DrawerSidebar story
- [ ] **Detox E2E:** App launches → drawer opens → navigate between screens → back button works
