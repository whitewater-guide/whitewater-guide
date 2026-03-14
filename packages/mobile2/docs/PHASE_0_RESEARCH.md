# Phase 0: Research & Validation

**Goal:** Identify core dependencies for RN 0.84.1 and highlight potential major incompatibilities. No exact version pinning needed — dependencies will not be installed all at once.

**Reference:** See `packages/mobile/DEPENDENCY_REVIEW.md` for the full dependency audit of the current mobile app.

---

## 0.1 — Critical dependency compatibility (must work)

These are foundational — the app cannot function without them. All are actively maintained by major teams (Software Mansion, React Navigation, Mapbox) and are assumed compatible with RN 0.84.1 unless evidence says otherwise.

| Package                        | Latest                        | Notes                                                                                       |
| ------------------------------ | ----------------------------- | ------------------------------------------------------------------------------------------- |
| react-native-reanimated        | 4.2.2                         | Software Mansion. New Arch support. Shared dep of bottom-sheet, victory-native, and others. |
| react-native-gesture-handler   | 2.30.0                        | Software Mansion. Same major as current. Shared dep of bottom-sheet, navigation.            |
| @react-navigation/native (v7)  | 7.1.33                        | Requires screens v4 + safe-area-context v5. Major API changes from v6.                      |
| react-native-screens           | 4.24.0                        | Required by navigation v7.                                                                  |
| react-native-safe-area-context | 5.7.0                         | Required by navigation v7.                                                                  |
| @rnmapbox/maps                 | 10.2.10 (stable), 10.3.0-rc.0 | Active development. Start with 10.2.10 stable.                                              |

### Cross-dependency graph

```
@react-navigation/native v7
  ├── react-native-screens v4
  ├── react-native-safe-area-context v5
  └── (optional) react-native-gesture-handler (for stack)

@gorhom/bottom-sheet v5
  ├── react-native-reanimated v4
  └── react-native-gesture-handler v2

victory-native v41
  └── react-native-reanimated v4

react-native-keyboard-controller v1
  └── (standalone, no reanimated dep)
```

The reanimated + gesture-handler pair is the shared foundation. Their latest versions are expected to work together and with all consumers above.

## 0.2 — Important dependencies (alternatives exist)

| Package                          | Latest  | Notes                                                                                       |
| -------------------------------- | ------- | ------------------------------------------------------------------------------------------- |
| @react-native-firebase/app       | 23.8.6  | 9 major versions behind current (v14). All firebase packages upgrade together. Modular API. |
| @sentry/react-native             | 8.3.0   | 3 major versions behind current (v5). Active.                                               |
| react-native-paper               | 5.15.0  | Same major. Minor bump only.                                                                |
| @gorhom/bottom-sheet             | 5.2.8   | Major bump 4→5. Depends on reanimated v4 + gesture-handler v2.                              |
| @shopify/flash-list              | 2.3.0   | Replaces react-native-big-list. New Arch support.                                           |
| victory-native                   | 41.20.2 | 5 major versions behind current (v36). Depends on reanimated.                               |
| react-native-svg                 | 15.15.3 | Major bump 13→15. Software Mansion.                                                         |
| react-native-keyboard-controller | 1.20.7  | Replaces react-native-keyboard-aware-scroll-view. Software Mansion.                         |
| react-native-bootsplash          | 7.1.0   | 3 major bumps from current (v4). By zoontek.                                                |
| react-native-mmkv                | 4.2.0   | By mrousavy. JSI-based, good New Arch support. Replaces react-native-mmkv-storage.          |
| react-native-device-info         | 15.0.2  | 5 major bumps. Very active.                                                                 |

## 0.3 — Image loading: FastImage replacement

### Background

The current app uses `@whitewater-guide/react-native-fast-image` (a fork of the archived `DylanVann/react-native-fast-image`). It is used in ~15 files for:

- **Progress tracking** on image load (`onProgress` events) — used in `LoadableImage` component
- **Image preloading** for offline mode (`FastImage.preload()`) — used in `PhotoDownloader`
- **Cache control** and priority-based loading
- **General image display** as a drop-in Image replacement

### Does modern RN's built-in Image suffice?

**No.** RN 0.84's built-in `Image` still lacks: priority-based loading, preload/prefetch API, programmatic cache management, BlurHash placeholders, and smooth transitions. The features that made FastImage necessary are still missing.

### expo-image as replacement

`expo-image` is the recommended modern alternative. It provides a superset of FastImage features:

- Same native backends (SDWebImage on iOS, Glide on Android)
- Priority-based loading, configurable caching, preloading via `Image.prefetch()`
- Programmatic cache management (`clearDiskCache()`, `clearMemoryCache()`)
- Download progress tracking
- BlurHash/ThumbHash placeholders, cross-dissolve transitions
- 12+ image formats (WebP, AVIF, HEIC, SVG)

**Bare RN support:** Yes — requires the `expo` package (Expo Modules infrastructure). Many bare RN projects now install `expo` solely to use individual Expo Modules. For projects without Continuous Native Generation, set `EXPO_IMAGE_DISABLE_LIBDAV1D=1` before `pod install`.

**Peer deps:** `expo` (required), `react`, `react-native` — all wildcards.

**Decision:** Use `expo-image`. The `expo` dependency is lightweight and increasingly standard in bare RN projects.

## 0.4 — Workspace & tooling compatibility

### React 18 → 19

**This is the biggest cross-cutting concern.** RN 0.84.1 has a peer dependency on React ^19.2.3.

Impact:

- The `web` package uses React 18 + Material-UI 4 (which does NOT support React 19 — requires MUI v5+)
- The `clients` package shares React code between web and mobile
- All shared packages with React peer deps need updating

**Decision:** The `mobile2` package will use React 19. The `web` package stays on React 18 for now. The `clients` package peer dep range must be widened to accept both React 18 and 19 (`^18.2.0 || ^19.0.0`), or mobile2 will need its own client code.

### Node.js 18 → 22

RN 0.84.1 requires Node.js >= 22.11.0. The workspace currently uses Node 18 (`.nvmrc`).

**Decision needed:** Update `.nvmrc` and CI to Node 22. Verify that backend and web packages work with Node 22 (they should — Node 22 is LTS).

### TypeScript ^5.2.2 → ^5.8.3

RN 0.84.1's `@react-native/typescript-config` expects TS ^5.8.3. The workspace uses ^5.2.2. This is a semver-compatible upgrade within the same major — low risk.

### Jest 29

RN 0.84.1 requires Jest ^29.6.3. The workspace already uses Jest ^29.7.0. **No conflict.**

### Metro 0.83.3

RN 0.84.1 uses Metro ^0.83.3. This is mobile-only (web uses CRA/webpack). No conflict with other packages.

Metro config in a pnpm monorepo needs:

- `watchFolders` pointing to monorepo root
- `nodeModulesPaths` for both local and root `node_modules`
- `disableHierarchicalLookup: true`
- Android `build.gradle`: `reactNativeDir`, `codegenDir`, `cliFile` paths adjusted for non-root app

### Babel ^7.25.2

RN 0.84.1 needs `@babel/core ^7.25.2`. Compatible with existing workspace Babel setup.

### Prettier

The workspace uses Prettier ^3.0.2. The RN template defaults to 2.8.8 but this is not a hard requirement. No conflict.

### @rnx-kit

`@rnx-kit/align-deps` supports RN 0.84 in its presets. Compatible.

## 0.5 — Workspace package compatibility

The shared workspace packages (`clients`, `commons`, `schema`, `validation`) have peer dependencies:

| Concern                               | Decision                                                                               |
| ------------------------------------- | -------------------------------------------------------------------------------------- |
| `@apollo/client` — currently `^3.8.2` | Stay on Apollo 3.x initially. Upgrade to 4.x in a follow-up phase.                     |
| `date-fns` — currently `^2.30.0`      | Stay on v2 initially. v3 is ESM-first.                                                 |
| `victory-*` chart libs in `clients`   | Must align with victory-native v41. Check if clients' victory usage is compatible.     |
| React peer dep in shared packages     | Widen to `^18.2.0 \|\| ^19.0.0` to support both web (React 18) and mobile2 (React 19). |

## 0.6 — Potential blockers summary

| Risk                                   | Severity   | Mitigation                                                                                   |
| -------------------------------------- | ---------- | -------------------------------------------------------------------------------------------- |
| React 19 incompatible with web's MUI 4 | **High**   | mobile2 uses React 19 independently; widen shared package peer deps                          |
| Node 22 requirement                    | **Medium** | Update .nvmrc and CI; verify backend/web compatibility                                       |
| `expo` dependency for expo-image       | **Low**    | Widely adopted pattern in bare RN projects                                                   |
| Firebase v14→v23 migration effort      | **Medium** | Scoped to mobile; modular API migration guide available                                      |
| react-navigation v6→v7 API changes     | **Medium** | Well-documented migration; done during screen migration                                      |
| npm peerDependencies may be stale      | **Info**   | Assume latest versions of actively maintained packages work together unless proven otherwise |

## 0.7 — No-research-needed items

The following are assumed to work and will be verified during implementation:

- All Software Mansion packages (reanimated, gesture-handler, screens, svg) — actively maintained, RN 0.84 support is their core business
- react-native-paper — same major, minor bump
- Pure JS packages (formik, date-fns, nanoid, coordinate-parser, use-debounce) — no native code, no RN version dependency
