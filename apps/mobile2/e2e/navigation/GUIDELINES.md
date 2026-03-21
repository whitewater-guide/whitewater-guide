# E2E Navigation Test Guidelines

## Philosophy

Tests emulate real user flows — open the app and navigate through multiple screens sequentially, without returning to a base state between each assertion. This keeps tests realistic and reduces execution time by avoiding repeated app reloads.

## Principles

### Fewer, longer test cases

Each `it()` block represents a complete user journey, not an isolated transition. A single test may visit 10+ screens. This mirrors how a QA engineer would manually test the app.

### No base-state reset between steps

Do NOT use `beforeEach` with `device.reloadReactNative()` unless you genuinely need independent starting states between `it()` blocks. Within a single `it()`, navigate forward continuously.

### Test typical paths, not all paths

The goal is to cover the most common user flows, not every possible navigation edge case. Each screen should be visited at least once, but not necessarily from every possible entry point.

### Back navigation: verify once per context

Don't test the back button from every screen. Verify it works once in a given navigation context (e.g., once from a region sub-screen, once from a section sub-screen) and move on.

### Deep links: once per test, only as a starting point

A deep link may be used at most once per `it()` block, and only as the very first navigation action (the test's entry point). Do not fire deep links mid-flow. This keeps each test case a single, predictable user journey. Group deep link tests in the same file as their tap-based counterparts.

### Auth state

E2E tests default to an authenticated user (via `AuthProvider.mock.tsx`). Only the auth flow test (`auth.test.ts`) exercises sign-in/sign-out. All other tests rely on the default authenticated state.

## File structure

```
e2e/navigation/
├── drawer.test.ts              — Drawer menu flow (non-auth items)
├── regionAndSection.test.ts    — Region/section tap flow + deep link flow
├── auth.test.ts                — Full auth lifecycle + deep link to auth reset
├── logbookAndDescent.test.ts   — Logbook/descent/form wizard flows
└── fabAndAddSection.test.ts    — FAB actions + add section tabs
```

## Helpers

Use shared helpers from `e2e/helpers/navigation.ts` and `e2e/helpers/auth.ts`:

| Helper                | Purpose                                    |
| --------------------- | ------------------------------------------ |
| `expectScreen(name)`  | Assert a screen is visible via its testID  |
| `tapDrawerItem(id)`   | Open drawer and tap a menu item            |
| `tapTab(name)`        | Tap a tab by screen name                   |
| `tapHeaderBack()`     | Tap the header back button                 |
| `navigateToRegion()`  | From REGIONS_LIST, navigate into a region  |
| `navigateToSection()` | From REGIONS_LIST, navigate into a section |
| `signIn()`            | Sign in via drawer → auth screens → submit |
| `signOut()`           | Sign out via My Profile screen             |

## Writing new tests

1. Identify the user flow you want to test
2. Write it as a single `it()` block that navigates through all relevant screens
3. Use `beforeEach` with `device.reloadReactNative()` only if you have multiple `it()` blocks that need independent starting states
4. Verify back navigation at most once per navigation context
5. Use a deep link at most once per `it()` block, and only as the first navigation action
6. Do not add auth setup — tests start authenticated by default
