# Mobile2 Migration Plan

**Goal:** Rebuild `apps/mobile` as `apps/mobile2` on React Native 0.84.1 with New Architecture, modern tooling, and improved testing.

**Dropped features:** In-app purchases (IAP), social authentication (Apple, Google, Facebook).

**Chat/comments:** Added last (planned refactor).

---

## Phases Overview

### Phase 0: Research & Validation ✅ DONE

Verify RN 0.84.1 compatibility of all critical dependencies (especially `@rnmapbox/maps@10.3.0-rc.0`) and confirm workspace package peer dependency constraints.

> **Detailed plan:** [PHASE_0_RESEARCH.md](PHASE_0_RESEARCH.md)

### Phase 1: Environment & Tooling Setup ✅ DONE

Initialize a fresh RN 0.84.1 project, configure monorepo integration, and set up dev tooling (React Native DevTools, Storybook v10, Detox, Jest).

> **Detailed plan:** [PHASE_1_ENVIRONMENT.md](PHASE_1_ENVIRONMENT.md)

### Phase 2: Native Assets & Platform Configuration ✅ DONE

Copy all native settings and assets from the old app: icons, fonts, native locales, permissions/manifests, splash screen (`react-native-bootsplash` v7), and build settings.

> **Detailed plan:** [PHASE_2_NATIVE_ASSETS.md](PHASE_2_NATIVE_ASSETS.md)

### Phase 3: Dependency Integration & Build Validation ✅ DONE

Install all major native dependencies one by one, verifying builds after each. Set up Storybook v10.2.3 for smoke-testing. Verify workspace package imports. End with i18n setup. Mapbox (`@rnmapbox/maps@10.3.0-rc.0`) installed, configured on both platforms, and smoke-tested in Storybook.

> **Detailed plan:** [PHASE_3_DEPENDENCIES.md](PHASE_3_DEPENDENCIES.md)

### Phase 4: Core Navigation Shell ✅ DONE

Build the full navigation skeleton with placeholder screens, drawer sidebar, deep linking, and custom header — using react-navigation v7. 36 screens defined, mock screens for all flows, 5 Detox E2E test files covering drawer, region/section tabs, auth stack, logbook, and add-section navigation.

> **Detailed plan:** [PHASE_4_NAVIGATION.md](PHASE_4_NAVIGATION.md)

### Phase 5: Apollo GraphQL + Auth (email/password only) ✅ DONE

**Goal:** App connects to backend, authenticates users, and fetches data. Apollo client with full link chain (access token, error, refresh, retry, HTTP). MobileAuthService with email/password sign-in/sign-up/reset. All auth screens built with `react-native-keyboard-controller`. Provider stack wired up. Unit tests for auth service, link chain, useAuthSubmit hook, and password validation.

> **Detailed plan:** [PHASE_5_AUTH.md](PHASE_5_AUTH.md)

### Phase 6: Regions List (first real data screen)

**Goal:** App displays the main regions list from the backend (i18n already set up in Phase 3).

**Scope:** Premium features (IAP lock, `PremiumBadge`) are dropped. Offline download button is **stubbed** (visible, non-functional) — full offline implementation is in Phase 11.

> **Detailed plan:** [PHASE_6_REGIONS_LIST.md](PHASE_6_REGIONS_LIST.md)

---

### Phase 7: Region Detail (maps + sections list + info)

**Goal:** Full region browsing experience with map, sections list, and info tabs.

> **Detailed plan:** [PHASE_7_REGION_DETAIL.md](PHASE_7_REGION_DETAIL.md)

---

### Phase 8: Section Detail (map + chart + info + media)

**Goal:** Complete section viewing experience — four-tab screen (Map, Chart, Info, Media) with section map, interactive flow/gauge chart, section info with collapsible table, and photo/video/blog gallery with pinch-to-zoom.

All required dependencies (`victory-native`, `@shopify/react-native-skia`, `react-native-worklets`, `react-native-gesture-handler`, `react-native-reanimated`) are already installed. `react-native-awesome-gallery` was skipped (incompatible with reanimated v4) — photo gallery is implemented with gesture-handler + reanimated v4 directly. `PaperTabBar` is already in place.

> **Detailed plan:** [PHASE_8_SECTION_DETAIL.md](PHASE_8_SECTION_DETAIL.md)

---

### Phase 9: User Features (Profile, Logbook, Descents)

**Goal:** Authenticated user features complete.

#### 9.1 — Install additional dependencies

```
formik (v2.4)
@zxcvbn-ts/core (replaces react-native-zxcvbn)
```

Note: `@react-native-community/datetimepicker`, `react-native-image-picker` already installed in Phase 3.

#### 9.2 — Build My Profile screen

- Profile display and edit
- Language selector
- Verification status
- Sign-out button
- Remove purchase history section (IAP dropped)

#### 9.3 — Build Logbook screens

- Logbook list (user's descents)
- Descent detail view
- Delete descent dialog

#### 9.4 — Build Descent Form

- Multi-screen form: section selection → date → level → comment
- Port `DescentFormContext` and `useNavHydrateFormik()` pattern
- Formik + Yup validation from `@whitewater-guide/validation`

#### 9.5 — Build form components

Port reusable form fields:

- `TextField`, `NumericField`, `CheckboxField`, `RatingField`
- `PasswordField` with `@zxcvbn-ts/core` strength indicator
- `ModalPickerField`
- `PhotoUploadField`
- `HelperText`, `SuccessText`
- Use `react-native-keyboard-controller` (already installed in Phase 3)

#### 9.6 — Build Add Section wizard

- Multi-tab form: main, attributes, description, flows, photos, river, gauge, shape
- Photo upload integration

#### 9.7 — Validation

- [ ] Profile loads and edits save to backend
- [ ] Logbook displays descents correctly
- [ ] Can create, view, and delete a descent
- [ ] Descent form navigates through all steps
- [ ] Add Section wizard works end-to-end
- [ ] Keyboard handling works correctly on all form screens
- [ ] **Unit tests:** Form validation, descent CRUD operations
- [ ] **Storybook:** All form field components, PasswordStrengthIndicator
- [ ] **Detox E2E:** Edit profile → create descent → view in logbook → delete

---

### Phase 10: Firebase, Sentry & Polish

**Goal:** Production infrastructure — push notifications, error tracking.

#### 10.1 — Install dependencies

```
@react-native-firebase/app (v23)
@react-native-firebase/messaging (v23)
@react-native-firebase/analytics (v23)
@sentry/react-native (v8)
```

Note: `react-native-bootsplash` and `react-native-device-info` already installed in Phases 2–3.

#### 10.2 — Firebase setup

- Configure Firebase for both platforms (GoogleService-Info.plist, google-services.json)
- Push notification registration and handling
- FCM token sent to backend after sign-in
- Analytics events

#### 10.3 — Sentry setup

- Configure `@sentry/react-native` v8
- Wrap app with `Sentry.wrap()`
- Port `trackError()` utility
- Screen tracking via navigation state changes

#### 10.4 — Remaining features

- Port `AppSettingsProvider` (map type preference, UI tips)
- Port `UploadsProvider` (photo upload queue)
- Port `BannersProvider`
- Suggestion screen
- WebView screen (FAQ, terms, privacy, backers)
- License screen
- Plain text screen

#### 10.5 — Build remaining provider stack

```
GestureHandlerRootView
└─ PaperProvider
   └─ ApolloProvider
      └─ TagsProvider
         └─ AuthProvider
            └─ I18nProvider
               └─ UploadsProvider
                  └─ RegionsFilterProvider
                     └─ AppSettingsProvider
                        └─ OfflineContentProvider
                           └─ ActionSheetProvider
                              └─ NavigationRoot
```

(Note: `ChatClientStateProvider` and `IapProvider` removed)

#### 10.6 — Validation

- [ ] Push notifications received on both platforms
- [ ] Sentry captures errors and shows in dashboard
- [ ] App settings persist across restarts
- [ ] Photo uploads work end-to-end
- [ ] **Unit tests:** Firebase messaging mock, upload provider
- [ ] **Detox E2E:** Full app flow — launch → splash → sign in → browse → receive notification

---

### Phase 11: Offline Support

**Goal:** Users can download regions for offline use. The download button on `RegionCard` was stubbed in Phase 6 (shows "coming soon" on tap) — replace the stub with real implementation here.

#### 11.1 — Port offline infrastructure

- `OfflineContentProvider`
- Map tile downloading via Mapbox offline packs
- Section data caching
- Photo caching
- Progress tracking
- Offline migration logic

#### 11.2 — Install dependencies

```
react-native-fs (or expo-file-system if no Expo dep)
expo-image
```

Note: `@react-native-community/netinfo` already installed in Phase 3. `expo-image` replaces the RN built-in `Image` used on `RegionCard` since Phase 6 — swap is a one-line import change (`resizeMode` → `contentFit`).

#### 11.3 — Build offline UI

- Download region button
- Download progress indicator
- Offline list header
- Offline date display

#### 11.4 — Validation

- [ ] Can download a region for offline use
- [ ] Offline content accessible in airplane mode
- [ ] Download progress displays correctly
- [ ] Can delete offline content
- [ ] **Unit tests:** Offline provider state management, download queue
- [ ] **Detox E2E:** Download region → enable airplane mode → browse region → delete

---

### Phase 12: Chat (Matrix) — Last Feature

**Goal:** Real-time chat in region and section screens.

> **Note:** This feature is planned for refactoring. Implementation details may change.

#### 12.1 — Install dependencies

```
matrix-js-sdk (latest v41)
```

#### 12.2 — Port chat infrastructure

- `ChatClientStateProvider` — Matrix client lifecycle
- Matrix client singleton with JWT authentication
- Room management

#### 12.3 — Build chat UI

- Chat screen with message list
- Input panel
- Message actions (reply, delete)
- Room start indicator
- Chat tabs in region and section screens

#### 12.4 — Validation

- [ ] Can send and receive messages
- [ ] Chat rooms load for regions and sections
- [ ] Message history loads
- [ ] **Unit tests:** Chat provider, message formatting
- [ ] **Detox E2E:** Navigate to region chat → send message → see it appear

---

### Phase 13: Release Infrastructure

**Goal:** App ready for distribution.

#### 13.1 — Fastlane setup

- Configure Fastlane for iOS (Match, TestFlight)
- Configure Fastlane for Android (Play Store, S3 for staging APKs)
- Build lanes: staging, production for both platforms

#### 13.2 — Version management

- Build number tracking in `app.json`
- Version sync with `package.json`

#### 13.3 — Code signing

- iOS: Fastlane Match with existing certificates
- Android: Keystore configuration

#### 13.4 — ProGuard / R8 rules

- Update ProGuard rules for new dependencies (seed rules copied in Phase 2)

#### 13.5 — Final validation

- [ ] Staging builds deploy to TestFlight and S3
- [ ] Production builds create distributable artifacts
- [ ] Full Detox E2E suite passes on both platforms
- [ ] Storybook documents all reusable components
- [ ] No TypeScript errors
- [ ] ESLint clean
- [ ] All unit tests pass

---

## Dependency Decisions Summary

### Use latest versions

| Package                                   | Version     | Replaces |
| ----------------------------------------- | ----------- | -------- |
| react-native                              | 0.84.1      | 0.72.6   |
| @rnmapbox/maps                            | 10.3.0-rc.0 | 10.0.15  |
| @react-navigation/\*                      | v7          | v6       |
| react-native-reanimated                   | v4          | v3       |
| react-native-screens                      | v4          | v3       |
| react-native-safe-area-context            | v5          | v4       |
| react-native-gesture-handler              | v2 (latest) | v2.13    |
| react-native-svg                          | v15         | v13      |
| react-native-paper                        | v5.15       | v5.11    |
| @gorhom/bottom-sheet                      | v5          | v4       |
| @react-native-firebase/\*                 | v23         | v14      |
| @sentry/react-native                      | v8          | v5       |
| react-native-bootsplash                   | v7          | v4       |
| react-native-device-info                  | v15         | v10      |
| react-native-pager-view                   | v8          | v6       |
| react-native-tab-view                     | v4          | v3       |
| react-native-image-picker                 | v8          | v7       |
| @react-native-async-storage/async-storage | v3          | v1       |
| @react-native-community/netinfo           | v12         | v11      |
| @react-native-community/datetimepicker    | v8          | v7       |
| @testing-library/react-native             | v13         | v12      |
| victory-native                            | v41         | v36      |

### Stay on current major (reduce scope)

| Package        | Version        | Reason                                                                   |
| -------------- | -------------- | ------------------------------------------------------------------------ |
| @apollo/client | 3.x (latest 3) | `clients` package requires ^3.8.2; Apollo 4 migration is separate effort |
| date-fns       | 2.x            | `validation` and `clients` packages require ^2.30.0                      |
| formik         | 2.x            | Stable, no need to change                                                |
| nanoid         | 3.x            | v4+ is ESM-only                                                          |

### Replace with modern alternatives

| Old                                       | New                                                                                                                | Reason                                                             |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| react-native-big-list                     | @shopify/flash-list                                                                                                | Industry standard, better perf                                     |
| react-native-image-zoom-viewer            | Custom (gesture-handler + reanimated v4)                                                                           | Old one abandoned, awesome-gallery incompatible with reanimated v4 |
| react-native-iphone-x-helper              | react-native-safe-area-context                                                                                     | Already a dep, use `useSafeAreaInsets()`                           |
| react-native-keyboard-aware-scroll-view   | react-native-keyboard-controller                                                                                   | Old one abandoned                                                  |
| react-native-avoid-softinput              | react-native-keyboard-controller                                                                                   | Consolidate keyboard handling                                      |
| react-native-zxcvbn                       | @zxcvbn-ts/core                                                                                                    | Pure TS, no native wrapper                                         |
| react-native-text-size                    | Text.onTextLayout                                                                                                  | Remove git dep                                                     |
| react-native-modal-popover                | Paper Menu component                                                                                               | Consolidate on Paper                                               |
| react-native-mmkv-storage                 | react-native-mmkv                                                                                                  | Better New Arch / JSI support                                      |
| react-native-ultimate-config              | react-native-config                                                                                                | ultimate-config abandoned                                          |
| react-native-snackbar                     | Paper Snackbar                                                                                                     | Consolidate on Paper                                               |
| @react-navigation/material-bottom-tabs    | Paper BottomNavigation                                                                                             | Dropped in nav v7                                                  |
| react-native-redash                       | Inline / reanimated builtins                                                                                       | Most utils now in reanimated 4                                     |
| @whitewater-guide/react-native-fast-image | `expo-image` **deferred to Phase 11** — expo-sdk not yet compatible with RN 0.84; Phase 6 uses RN built-in `Image` | Original archived                                                  |
| @testing-library/react-hooks              | @testing-library/react-native renderHook                                                                           | Deprecated                                                         |
| Flipper                                   | React Native DevTools                                                                                              | Flipper deprecated in RN 0.73+                                     |
| react-native-bundle-splitter              | React.lazy + Suspense                                                                                              | Built into React 18, no extra dep needed                           |

### Drop entirely

| Package                                      | Reason                                      |
| -------------------------------------------- | ------------------------------------------- |
| react-native-iap                             | IAP feature dropped                         |
| react-native-fbsdk-next                      | Facebook auth dropped                       |
| @invertase/react-native-apple-authentication | Apple auth dropped                          |
| react-native-url-polyfill                    | Hermes in RN 0.84 has full URL support      |
| react-native-startup-time                    | Not updated since 2023, not critical        |
| @react-native-community/hooks                | Simple hooks, implement inline              |
| deprecated-react-native-prop-types           | Only needed for RN 0.68-0.72                |
| react-native-mock-render                     | Not needed with modern RN testing           |
| react-native-code-push                       | Evaluate later if needed                    |
| apollo-link-token-refresh                    | Evaluate: may implement custom refresh link |

---

## Modern Tooling Summary

### Development

| Tool                           | Purpose                                            | When Added |
| ------------------------------ | -------------------------------------------------- | ---------- |
| React Native DevTools          | Debugging, inspection, network (replaces Flipper)  | Phase 1    |
| Storybook for React Native v10 | Component development, visual testing, smoke tests | Phase 3    |
| TypeScript strict mode         | Type safety                                        | Phase 1    |
| ESLint + Prettier              | Code quality (shared monorepo config)              | Phase 1    |

### Testing

| Tool                                     | Purpose                                         | When Added |
| ---------------------------------------- | ----------------------------------------------- | ---------- |
| Jest + @testing-library/react-native v13 | Unit & component tests                          | Phase 1    |
| Detox                                    | Gray-box E2E testing (RN-aware synchronization) | Phase 1    |
| Storybook interaction tests              | Visual component testing & smoke tests          | Phase 3    |

### Build & Release

| Tool                       | Purpose                  | When Added |
| -------------------------- | ------------------------ | ---------- |
| Fastlane                   | Build automation         | Phase 13   |
| react-native-config        | Environment management   | Phase 1    |
| react-native-bootsplash v7 | Splash screen generation | Phase 2    |

---

## Parallel Development Strategy

Every phase delivers working iOS + Android builds with feature parity:

| Phase | iOS Validation                            | Android Validation                       |
| ----- | ----------------------------------------- | ---------------------------------------- |
| 1     | Simulator: blank app launches             | Emulator: blank app launches             |
| 2     | Simulator: app with icons + splash        | Emulator: app with icons + splash        |
| 3     | Simulator: all deps build, Storybook runs | Emulator: all deps build, Storybook runs |
| 4     | Simulator: nav + map renders              | Emulator: nav + map renders              |
| 5     | Simulator + Device: auth flow             | Emulator: auth flow                      |
| 6+    | Simulator + Device: full feature          | Emulator: full feature                   |

**CI note:** Consider adding GitHub Actions for running tests on PR (unit + Detox on emulator).
