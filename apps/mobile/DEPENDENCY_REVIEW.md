# Mobile Dependency Review for RN Upgrade

**Date:** March 2026
**Current RN:** 0.72.6 | **Target RN:** 0.84.1 (latest stable)
**Gap:** 12 minor versions behind. New Architecture became default in 0.76.

---

## Legend

| Status   | Meaning                                        |
| -------- | ---------------------------------------------- |
| OK       | Actively maintained, simple version bump       |
| UPGRADE  | Actively maintained, breaking changes expected |
| REPLACE  | Abandoned/archived, must find alternative      |
| EVALUATE | May be unnecessary or replaceable              |

---

## Dependencies

### React Native Core Ecosystem

| Package                        | Current  | Latest  | Last Updated | Status  | Notes                                                          |
| ------------------------------ | -------- | ------- | ------------ | ------- | -------------------------------------------------------------- |
| react-native                   | ^0.72.6  | 0.84.1  | 2026-03-08   | UPGRADE | 12 versions behind. New Arch default since 0.76. Major effort. |
| react-native-gesture-handler   | ^2.13.4  | 2.30.0  | 2026-03-06   | OK      | Same major, semver-compatible. Software Mansion.               |
| react-native-reanimated        | ^3.5.4   | 4.2.2   | 2026-03-06   | UPGRADE | Major bump 3->4. Software Mansion. Must align with RN version. |
| react-native-screens           | ^3.27.0  | 4.24.0  | 2026-03-07   | UPGRADE | Major bump 3->4. Required by react-navigation 7.               |
| react-native-safe-area-context | ^4.7.4   | 5.7.0   | 2026-02-24   | UPGRADE | Major bump 4->5. Required by react-navigation 7.               |
| react-native-svg               | ^13.14.0 | 15.15.3 | 2026-02-12   | UPGRADE | Major bump 13->15. Software Mansion. Actively maintained.      |
| react-native-webview           | ^13.6.2  | 13.16.1 | 2026-02-27   | OK      | Same major, minor bump only.                                   |

### Navigation (react-navigation 6 -> 7)

| Package                                | Current | Latest | Last Updated | Status  | Notes                                                                                                                       |
| -------------------------------------- | ------- | ------ | ------------ | ------- | --------------------------------------------------------------------------------------------------------------------------- |
| @react-navigation/native               | ^6.1.9  | 7.1.33 | 2026-03-05   | UPGRADE | Major rewrite. v7 has new API patterns.                                                                                     |
| @react-navigation/stack                | ^6.3.20 | 7.8.4  | 2026-03-05   | UPGRADE | Must upgrade with navigation/native.                                                                                        |
| @react-navigation/drawer               | ^6.6.6  | 7.9.4  | 2026-03-05   | UPGRADE | Must upgrade with navigation/native.                                                                                        |
| @react-navigation/material-top-tabs    | ^6.6.5  | 7.4.18 | 2026-03-05   | UPGRADE | Must upgrade with navigation/native.                                                                                        |
| @react-navigation/material-bottom-tabs | ^6.2.19 | 6.2.29 | 2024-07-16   | REPLACE | Last updated Jul 2024. Likely dropped in v7. Use react-native-paper's BottomNavigation with navigation integration instead. |

### Firebase

| Package                          | Current  | Latest | Last Updated | Status  | Notes                                                                                                                      |
| -------------------------------- | -------- | ------ | ------------ | ------- | -------------------------------------------------------------------------------------------------------------------------- |
| @react-native-firebase/app       | ^14.12.0 | 23.8.6 | 2026-02-03   | UPGRADE | 9 major versions behind. All firebase packages must be upgraded together. Modular API pattern adopted. Significant effort. |
| @react-native-firebase/analytics | ^14.12.0 | 23.8.6 | 2026-02-03   | UPGRADE | Must match @react-native-firebase/app version.                                                                             |
| @react-native-firebase/messaging | ^14.12.0 | 23.8.6 | 2026-02-03   | UPGRADE | Must match @react-native-firebase/app version.                                                                             |

### Community/Platform Packages

| Package                                   | Current | Latest  | Last Updated | Status   | Notes                                                                                                        |
| ----------------------------------------- | ------- | ------- | ------------ | -------- | ------------------------------------------------------------------------------------------------------------ |
| @react-native-async-storage/async-storage | ^1.19.4 | 3.0.1   | 2026-02-23   | UPGRADE  | 2 major versions behind. Review migration guide.                                                             |
| @react-native-clipboard/clipboard         | ^1.12.1 | 1.16.3  | 2025-06-28   | OK       | Minor bump. Broad RN peer dep.                                                                               |
| @react-native-community/datetimepicker    | ^7.6.1  | 8.6.0   | 2026-01-06   | UPGRADE  | 1 major version bump.                                                                                        |
| @react-native-community/hooks             | ^3.0.0  | 100.1.0 | 2025-02-21   | EVALUATE | Unusual version jump. Last updated 1yr ago. Simple hooks that could be replaced with custom implementations. |
| @react-native-community/netinfo           | ^11.0.0 | 12.0.1  | 2026-02-14   | UPGRADE  | 1 major bump. Broad RN peer dep.                                                                             |
| @react-native-masked-view/masked-view     | ^0.3.0  | 0.3.2   | 2025-09-09   | OK       | Patch bump. Small stable package.                                                                            |

### UI Libraries

| Package                         | Current | Latest | Last Updated | Status  | Notes                                           |
| ------------------------------- | ------- | ------ | ------------ | ------- | ----------------------------------------------- |
| react-native-paper              | ^5.11.1 | 5.15.0 | 2026-02-04   | OK      | Same major, minor bump. Callstack.              |
| @gorhom/bottom-sheet            | ^4.5.0  | 5.2.8  | 2025-12-04   | UPGRADE | Major bump 4->5.                                |
| @expo/react-native-action-sheet | ^4.0.1  | 4.1.1  | 2026-02-25   | OK      | Minor bump.                                     |
| react-native-linear-gradient    | ^2.8.2  | 2.8.3  | 2026-02-11   | OK      | Patch bump.                                     |
| react-native-vector-icons       | ^10.0.1 | 10.3.0 | 2025-07-23   | OK      | Minor bump.                                     |
| react-native-pager-view         | ^6.2.2  | 8.0.0  | 2025-12-17   | UPGRADE | 2 major bumps 6->8.                             |
| react-native-tab-view           | ^3.5.2  | 4.2.2  | 2026-03-03   | UPGRADE | Major bump 3->4. Aligned with react-navigation. |

### Abandoned / Must Replace

| Package                                 | Current | Latest | Last Updated | Status   | Alternative                                                                                                                                                                               |
| --------------------------------------- | ------- | ------ | ------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| react-native-image-zoom-viewer          | ^3.0.1  | 3.0.1  | 2022-11      | REPLACE  | `react-native-awesome-gallery` (0.4.3) or custom with gesture-handler + reanimated                                                                                                        |
| react-native-iphone-x-helper            | ^1.3.1  | 1.3.1  | 2022-05      | REPLACE  | `react-native-safe-area-context` (already a dep) - use `useSafeAreaInsets()`                                                                                                              |
| react-native-keyboard-aware-scroll-view | ^0.9.5  | 0.9.5  | 2022-06      | REPLACE  | `react-native-keyboard-controller` (1.20.7, updated 2026-02)                                                                                                                              |
| react-native-zxcvbn                     | ^1.0.1  | 1.0.1  | 2022-05      | REPLACE  | `@zxcvbn-ts/core` (3.0.4, updated 2026-03) - pure TS, no RN wrapper needed                                                                                                                |
| react-native-text-size                  | git dep | N/A    | N/A          | REPLACE  | Use `Text.onTextLayout` or `PixelRatio` calculations. Git dep = maintenance burden.                                                                                                       |
| react-native-modal-popover              | ^2.1.3  | 2.1.3  | 2022-12      | REPLACE  | Use Paper's `Menu` component or `react-native-popover-view`                                                                                                                               |
| react-native-redash                     | ^18.1.1 | 18.1.5 | 2026-01      | EVALUATE | Was a Reanimated v1/v2 utility lib. Most utilities now built into Reanimated 3/4. Audit actual usage and inline or use reanimated built-ins. Note: got a recent update so may still work. |

### Evaluate / Possibly Unnecessary

| Package                      | Current | Latest | Last Updated | Status   | Notes                                                                                                                                                                                                            |
| ---------------------------- | ------- | ------ | ------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| react-native-url-polyfill    | ^2.0.0  | 3.0.0  | 2025-09      | EVALUATE | Hermes in RN 0.84 may have full URL support, making this unnecessary. Test first.                                                                                                                                |
| react-native-snackbar        | ^2.6.2  | 3.0.1  | 2026-02-27   | EVALUATE | react-native-paper already has a Snackbar component. Consider consolidating.                                                                                                                                     |
| react-native-startup-time    | ^2.0.1  | 2.1.0  | 2023-08      | EVALUATE | Last updated 2023. Small API surface. May need patches for New Arch.                                                                                                                                             |
| react-native-mmkv-storage    | ^0.9.1  | 12.0.1 | 2025-12      | EVALUATE | Still updated but `react-native-mmkv` by mrousavy (4.2.0, updated 2026-03) is the more popular JSI-based alternative with better New Arch support. Note: mmkv-storage also got major updates so both are viable. |
| react-native-ultimate-config | ^6.0.1  | 6.0.1  | 2023-09      | EVALUATE | Last updated 2023. No updates in 2.5 years. `react-native-config` is more popular. May break with new RN.                                                                                                        |

### Other Dependencies (Non-RN-specific)

| Package                                      | Current  | Latest      | Last Updated | Status   | Notes                                                                                                                              |
| -------------------------------------------- | -------- | ----------- | ------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| @apollo/client                               | ^3.8.6   | 4.1.6       | 2026-03-05   | UPGRADE  | Major bump 3->4. Active. Significant API changes likely.                                                                           |
| apollo-link-token-refresh                    | ^0.6.1   | 0.7.0       | 2024-06      | EVALUATE | Low activity. May need to check Apollo 4 compat.                                                                                   |
| apollo3-cache-persist                        | ^0.14.1  | 0.15.0      | 2024-03      | EVALUATE | Name says "apollo3" - check if Apollo 4 compatible or if a new package exists.                                                     |
| @invertase/react-native-apple-authentication | ^2.3.0   | 2.5.1       | 2026-01      | OK       | Minor bump. Active.                                                                                                                |
| @rnmapbox/maps                               | ^10.0.15 | 10.2.10     | 2026-03-01   | OK       | Minor bump. Very active.                                                                                                           |
| @ronradtke/react-native-markdown-display     | ^8.0.0   | 8.1.0       | 2025-01      | OK       | Minor bump. Low activity but stable.                                                                                               |
| @sentry/react-native                         | ^5.12.0  | 8.3.0       | 2026-03-05   | UPGRADE  | 3 major bumps 5->8. Very active.                                                                                                   |
| @whitewater-guide/react-native-fast-image    | ^8.6.0   | N/A         | N/A          | EVALUATE | Fork of react-native-fast-image (original archived). Check if fork supports New Arch. Consider `expo-image` as modern alternative. |
| react-native-avoid-softinput                 | ^4.0.1   | 8.0.2       | 2025-10      | UPGRADE  | 4 major bumps. v8 requires RN >= 0.78.                                                                                             |
| react-native-bootsplash                      | ^4.7.5   | 7.1.0       | 2026-02-22   | UPGRADE  | 3 major bumps. By zoontek. Active.                                                                                                 |
| react-native-bundle-splitter                 | ^2.2.3   | 3.1.1       | 2025-12      | UPGRADE  | Major bump. Active.                                                                                                                |
| react-native-device-info                     | ^10.11.0 | 15.0.2      | 2026-02-21   | UPGRADE  | 5 major bumps. Very active.                                                                                                        |
| react-native-fbsdk-next                      | ^12.1.0  | 13.4.3      | 2026-02-02   | UPGRADE  | 1 major bump. Active.                                                                                                              |
| react-native-iap                             | ^12.11.0 | 14.7.14     | 2026-03-04   | UPGRADE  | 2 major bumps. Now uses `react-native-nitro-modules`. Significant migration.                                                       |
| react-native-image-picker                    | ^7.0.2   | 8.2.1       | 2025-05      | UPGRADE  | 1 major bump. Moderate activity (last update 10mo ago).                                                                            |
| react-native-localize                        | ^3.0.2   | 3.7.0       | 2026-02-22   | OK       | Minor bump. By zoontek. Active.                                                                                                    |
| react-native-sensitive-info                  | ^5.5.8   | 5.6.2       | 2025-12      | OK       | Patch bump. Consider `react-native-keychain` if issues arise.                                                                      |
| react-native-big-list                        | ^1.6.1   | 1.6.4       | 2025-10      | EVALUATE | Low activity. `@shopify/flash-list` (2.3.0, updated 2026-03) is the industry standard.                                             |
| formik                                       | ^2.4.5   | 2.4.9       | 2025-11      | OK       | Patch bump. Stable.                                                                                                                |
| matrix-js-sdk                                | ^29.1.0  | 41.1.0-rc.0 | 2026-03-03   | UPGRADE  | 12 major bumps. Very active (Element/Matrix.org).                                                                                  |
| victory-native                               | ^36.6.11 | 41.20.2     | 2025-12      | UPGRADE  | 5 major bumps. Active.                                                                                                             |
| react-use                                    | ^17.4.0  | 17.6.0      | 2024-12      | OK       | Minor bump.                                                                                                                        |
| coordinate-parser                            | ^1.0.7   | 1.0.7       | 2022-06      | OK       | Stable/complete. Pure JS utility.                                                                                                  |
| pretty-bytes                                 | ^6.1.1   | 7.1.0       | 2025-09      | OK       | ESM-only in v7. Check import compat.                                                                                               |
| use-debounce                                 | ^9.0.4   | 10.1.0      | 2026-01      | UPGRADE  | 1 major bump.                                                                                                                      |
| date-fns                                     | ^2.30.0  | N/A         | N/A          | EVALUATE | v3 is available with ESM-first design.                                                                                             |
| nanoid                                       | ^3.3.6   | N/A         | N/A          | OK       | v3 is fine for RN. v4+ is ESM-only.                                                                                                |

### DevDependencies

| Package                                  | Current | Latest | Last Updated | Status   | Notes                                                                                             |
| ---------------------------------------- | ------- | ------ | ------------ | -------- | ------------------------------------------------------------------------------------------------- |
| @testing-library/react-native            | ^12.3.2 | 13.3.3 | 2026-01      | UPGRADE  | Major bump. Active.                                                                               |
| @testing-library/react-hooks             | ^8.0.1  | 8.0.1  | 2025-12      | EVALUATE | Deprecated. Use `renderHook` from `@testing-library/react-native` instead.                        |
| @rnx-kit/babel-preset-metro-react-native | ^1.1.5  | 3.0.2  | 2026-02      | UPGRADE  | 2 major bumps. Active (Microsoft).                                                                |
| @rnx-kit/metro-config                    | ^1.3.12 | 2.2.4  | 2026-02      | UPGRADE  | Major bump. Active.                                                                               |
| @rnx-kit/metro-resolver-symlinks         | ^0.1.34 | 0.2.11 | 2026-01      | UPGRADE  | Minor bump but pre-1.0.                                                                           |
| react-native-mock-render                 | ^0.1.9  | 0.1.9  | 2022-06      | REPLACE  | Last updated 2022. Likely broken with modern RN. May not be needed with modern jest + RN testing. |
| deprecated-react-native-prop-types       | ^5.0.0  | 5.0.0  | 2023-10      | REPLACE  | Exists only for RN 0.68-0.72 compat shim. Not needed with RN 0.84. Remove.                        |

---

## Summary: Effort Estimate

### High Effort (significant API changes, migration guides needed)

1. **react-native** 0.72 -> 0.84 (12 versions, New Architecture)
2. **react-navigation** 6 -> 7 (full navigation API rewrite)
3. **@react-native-firebase/\*** 14 -> 23 (9 major versions, modular API)
4. **@apollo/client** 3 -> 4 (major rewrite, check cache-persist & token-refresh compat)
5. **@sentry/react-native** 5 -> 8 (3 major versions)
6. **react-native-reanimated** 3 -> 4 (check all animation code)
7. **matrix-js-sdk** 29 -> 41 (12 major versions)
8. **victory-native** 36 -> 41 (5 major versions)

### Medium Effort (breaking changes but scoped)

9. **react-native-screens** 3 -> 4
10. **react-native-safe-area-context** 4 -> 5
11. **react-native-svg** 13 -> 15
12. **react-native-iap** 12 -> 14 (nitro modules migration)
13. **react-native-device-info** 10 -> 15
14. **react-native-bootsplash** 4 -> 7
15. **react-native-avoid-softinput** 4 -> 8
16. **react-native-async-storage** 1 -> 3
17. **@gorhom/bottom-sheet** 4 -> 5
18. **react-native-pager-view** 6 -> 8

### Must Replace (6 packages)

19. **react-native-image-zoom-viewer** -> `react-native-awesome-gallery`
20. **react-native-iphone-x-helper** -> `react-native-safe-area-context`
21. **react-native-keyboard-aware-scroll-view** -> `react-native-keyboard-controller`
22. **react-native-zxcvbn** -> `@zxcvbn-ts/core`
23. **react-native-text-size** (git dep) -> `Text.onTextLayout` or custom
24. **react-native-modal-popover** -> Paper's `Menu` or `react-native-popover-view`

### Should Evaluate

25. **react-native-mmkv-storage** vs `react-native-mmkv` (mrousavy)
26. **react-native-big-list** vs `@shopify/flash-list`
27. **react-native-snackbar** vs Paper's built-in Snackbar
28. **react-native-url-polyfill** - may be unnecessary with modern Hermes
29. **react-native-ultimate-config** - not updated since 2023
30. **react-native-redash** - audit usage, replace with reanimated built-ins
31. **@whitewater-guide/react-native-fast-image** - consider `expo-image`
32. **apollo3-cache-persist / apollo-link-token-refresh** - check Apollo 4 compat
33. **@testing-library/react-hooks** - deprecated, use renderHook from react-native testing lib
34. **deprecated-react-native-prop-types** - remove (only for RN 0.68-0.72)
35. **react-native-mock-render** - likely not needed with modern RN testing
