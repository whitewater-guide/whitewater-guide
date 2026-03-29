# Phase 5: Apollo GraphQL + Auth (email/password only)

**Goal:** App connects to backend, authenticates users, and fetches data.

---

## 5.1 — Install dependencies

```
@apollo/client (v3.x — stay on 3 for compatibility with clients package)
graphql, graphql-tag
apollo3-cache-persist
apollo-link-token-refresh
jwt-decode
@zxcvbn-ts/core, @zxcvbn-ts/language-common
```

Note: `react-native-mmkv`, `react-native-sensitive-info`, and `react-native-keyboard-controller` already installed in Phase 3.

---

## 5.2 — Set up Apollo client

Port from: `apps/mobile/src/core/apollo/`

| Old file | Description | Notes |
|----------|-------------|-------|
| `client.ts` | ApolloClient init with cache + link chain | Adapt to new MMKV API |
| `createLink.ts` | Link chain composition | Port as-is |
| `cache.ts` | Apollo cache + MMKV persistence (schema versioning) | Replace `MMKVStorageWrapper` with `react-native-mmkv` instance |
| `links/acessTokenLink.ts` | `setContext` link attaching Bearer token | Port as-is |
| `links/refreshJwtLink.ts` | `TokenRefreshLink` — JWT expiry detection, operation queuing, auto-refresh | Port as-is |
| `links/httpLink.ts` | HTTP link with headers (Accept-Language, Cache-Control, X-Client) | Update version header |
| `links/retryLink.ts` | Retry on network/500 errors | Port as-is |

Link chain order: `accessTokenLink` → `errorLink` → `removeTypenameFromVariables` → `TokenRefreshLink` → `retryLink` → `httpLink`

- Configure cache with `configureApolloCache()` from `@whitewater-guide/clients`
- Set up MMKV-backed cache persistence (using `react-native-mmkv` instead of old `mmkv-storage`)
- Port cache schema versioning (purge on mismatch)

---

## 5.3 — Implement auth service

Port from: `apps/mobile/src/core/auth/`

| Old file | Description | Notes |
|----------|-------------|-------|
| `service.ts` | `MobileAuthService` extending `BaseAuthService` | **Drop** `signInWithFacebook`, `signInWithApple`, FCM token management. Keep local sign-in, sign-up, refresh, sign-out, reset |
| `tokens.ts` | `SecureTokenStorage` via `react-native-sensitive-info` | Port as-is (iOS keychain, Android shared prefs) |

Shared library files used (no changes needed):
- `packages/clients/src/auth/service.ts` — `BaseAuthService` abstract class
- `packages/clients/src/auth/AuthProvider.tsx` — Provider component
- `packages/clients/src/auth/context.ts` / `useAuth.tsx` — React context + hook
- `packages/clients/src/auth/types.ts` — `AuthService`, `TokenStorage`, `Credentials`, etc.
- `packages/clients/src/auth/inflateError.ts` / `createApolloServerError.ts` — Error handling
- `packages/clients/src/auth/myProfile.generated.ts` — `useMyProfileQuery`

Implementation:
- Create `MobileAuthService` extending `BaseAuthService` from `@whitewater-guide/clients`
- Implement email/password sign-in, sign-up, password reset
- **Drop:** Facebook, Apple, Google sign-in
- **Drop:** FCM token management (add back in a later phase if needed)
- JWT token storage via `react-native-sensitive-info`
- Auto-refresh on app resume via AppState listener
- Port `AuthProvider` wrapping

Also port from `apps/mobile/src/core/navigation/`:

| Old file | Description | Notes |
|----------|-------------|-------|
| `useSignOut.ts` | Listens to auth service `sign-out` event; resets nav stack + purges Apollo cache | Adapt to new navigation structure |

---

## 5.4 — Set up GraphQL codegen for mobile2

- Add mobile2 entry to root `codegen.yml`
- Create local schema if needed (`mobile-local-schema.graphql` for offline support)
- Generate typed hooks and fragments

---

## 5.5 — Build auth screens

Port from: `apps/mobile/src/screens/auth/`

### Screens to port

| Old screen dir | Screen | Notes |
|----------------|--------|-------|
| `main/` | **Auth Main** — entry with Register + Sign In buttons, legal links | Drop social sign-in buttons. Port: `AuthMainScreen.tsx`, `LocalButton.tsx` |
| `signin/` | **Sign In** — email + password form | Port: `SignInScreen.tsx`, `SignInForm.tsx`, `getValidationSchema.ts`. Uses `useAuthSubmit` hook |
| `register/` | **Register** — email, name, password, language, imperial | Port: `RegisterScreen.tsx`, `RegisterForm.tsx`, `getValidationSchema.ts`. Uses zxcvbn for password strength |
| `forgot/` | **Forgot Password** — email form, shows success message | Port: `ForgotScreen.tsx`, `ForgotForm.tsx`, `getValidationSchema.ts` |
| `reset/` | **Reset Password** — deep link target with token validation | Port: `ResetScreen.tsx`, `ResetForm.tsx`, `MissingParams.tsx`, `getValidationSchema.ts`. Uses zxcvbn |
| `welcome/` | **Welcome** — post-signup, checks verified status | Port: `WelcomeScreen.tsx` |

**Drop entirely:** `social/` (Facebook, Apple buttons), `connect-email/`, `connect-email-request/`, `connect-email-success/`

### Shared auth utilities to port

| Old file | Description | Notes |
|----------|-------------|-------|
| `AuthStack.tsx` | Stack navigator composing auth screens | Already exists in mobile2, replace mock screens with real ones |
| `AuthScreenBase.tsx` | Base wrapper with logo + scrollable form area | **Rewrite** using `KeyboardAwareScrollView` (see §5.5.1) |
| `useAuthSubmit.ts` | Hook: calls auth API, maps errors to Formik fields | Port as-is |
| `getFormErrors.ts` | Utility for form error handling | Port as-is |
| `types.ts` | Auth stack param types | Already defined in mobile2 |

### Form components to port

| Old file | Description | Notes |
|----------|-------------|-------|
| `forms/password-field/PasswordField.tsx` | Formik-integrated password input with optional strength indicator | Port with React Native Paper `TextInput` |
| `forms/password-field/PasswordInput.tsx` | Core input with show/hide toggle | Port with Paper's `TextInput.Icon` |
| `forms/password-field/PasswordStrengthIndicator.tsx` | Color-coded strength bars (5 levels) | **Rewrite** using `@zxcvbn-ts/core` instead of `react-native-zxcvbn` |

### 5.5.1 — Keyboard handling

The old app had persistent UX issues with the keyboard overlapping form elements. It used a combination of:
- A custom patched `KeyboardAvoidingView` (fixing RN bugs #28798, #29239)
- `FullScreenKAV` with platform-specific behavior (`padding` on iOS, `height` on Android)
- `useAvoidKeyboard` hook using `react-native-avoid-softinput` with manual scroll offset calculations
- All of this was fragile and still had edge-case overlaps

**New approach:** Use `react-native-keyboard-controller` (v1.21.0, already installed) which provides a consistent cross-platform solution with Reanimated integration.

**Setup:**
1. Wrap app root with `KeyboardProvider` (in provider stack, see §5.6)
2. Replace `AuthScreenBase`'s `ScrollView` + `useAvoidKeyboard` with `KeyboardAwareScrollView`:
   ```tsx
   import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

   // AuthScreenBase — replaces ScrollView + useAvoidKeyboard entirely
   <KeyboardAwareScrollView bottomOffset={50} style={styles.scroll}>
     <View style={styles.body}>
       <Logo />
       {children}
     </View>
   </KeyboardAwareScrollView>
   ```
   `KeyboardAwareScrollView` automatically scrolls the focused input into view. The `bottomOffset` prop controls spacing between the keyboard and the focused input. No manual measurement or platform-specific logic needed.

3. Add `KeyboardToolbar` for prev/next/done navigation between inputs:
   ```tsx
   import { KeyboardAwareScrollView, KeyboardToolbar } from 'react-native-keyboard-controller';

   // Per-screen or in AuthScreenBase
   <>
     <KeyboardAwareScrollView bottomOffset={35}>
       {/* form fields */}
     </KeyboardAwareScrollView>
     <KeyboardToolbar />
   </>
   ```
   This gives users native-feeling prev/next buttons above the keyboard to navigate between TextInputs, which is especially useful on Register (5+ fields).

4. Drop entirely: `useAvoidKeyboard.ts`, custom `KeyboardAvoidingView`, `FullScreenKAV`

---

## 5.6 — Provider stack (partial)

```
GestureHandlerRootView
└─ PaperProvider
   └─ KeyboardProvider          ← NEW (react-native-keyboard-controller)
      └─ ApolloProvider
         └─ TagsProvider
            └─ AuthProvider
               └─ I18nProvider
                  └─ NavigationRoot
```

---

## 5.7 — E2E tests

The existing `e2e/navigation/auth.test.ts` already validates the full auth lifecycle using mock screens. When real screens replace the mocks, the same test structure applies — only the screen internals change while testIDs and navigation flow remain identical.

### Test 1: Full auth lifecycle (existing, to be extended)

Single long journey following e2e guidelines (fewer, longer tests; no base-state reset):

1. Start authenticated (e2e default via `AuthProvider.mock.tsx`)
2. Open drawer → verify My Profile visible → tap → sign out
3. Verify redirect to REGIONS_LIST
4. Verify auth gate: tap Logbook → redirected to AUTH_MAIN
5. AUTH_MAIN → AUTH_SIGN_IN → AUTH_FORGOT → **fill email, submit, verify success message** → back to AUTH_SIGN_IN
6. **Fill email/password, submit sign-in** → REGIONS_LIST (now authenticated)
7. Verify authenticated: drawer shows My Profile, Logbook accessible
8. Sign out again
9. AUTH_MAIN → AUTH_REGISTER → **fill name/email/password, submit** → AUTH_WELCOME
10. Verify authenticated: drawer shows My Profile

Steps 5–6 and 8–10 are new: once real screens land, the test will interact with actual TextInputs and submit buttons instead of mock navigation buttons. Sign-in is tested first; then sign-out resets state so register can be tested separately.

### Test 2: Deep link to reset password (existing, to be extended)

- `device.openURL({ url: 'https://app.whitewater.guide/auth/reset/token123' })`
- Verify AUTH_RESET screen shown with token param
- **Fill new password, submit, verify success or navigation back**

### What's mocked in e2e

| Component | Mock | How |
|-----------|------|-----|
| **Auth service** | `MockAuthService` (`src/core/auth/MockAuthService.ts`) | No real backend in e2e. `signIn()` emits `sign-in` event + returns mock tokens. `signUp()`, `requestReset()`, `reset()` all return `{ success: true }`. `signOut()` emits `sign-out` event |
| **Auth provider** | `AuthProvider.mock.tsx` — Detox override of `AuthProvider.tsx` via metro source extension priority | Needed because the real `AuthProvider` (from `@whitewater-guide/clients`) calls `useMyProfileQuery` to fetch the current user via GraphQL. With no backend running, that query would fail. The mock bypasses GraphQL entirely: it starts with `me = MOCK_USER` and toggles state by subscribing to `MockAuthService` events (`sign-in` → set me, `sign-out` → clear me) |
| **Backend/network** | Not running | All auth calls go through MockAuthService which never hits the network |
| **Navigation** | Real navigation stack | Not mocked — tests exercise actual react-navigation |

The mock auth screens (`src/screens/mock/MockAuth*.tsx`) will be **deleted** once real screens are built. `MockAuthService` and `AuthProvider.mock.tsx` stay — they're the e2e backend substitute.

---

## 5.8 — Unit tests

Only complex logic with meaningful branching — no screen rendering tests.

### `MobileAuthService` (port from `apps/mobile/src/core/auth/service.test.ts`)

The old test suite covers the auth service thoroughly. Port with these changes:

- **Drop:** All Facebook/Apple sign-in tests
- **Drop:** FCM token tests (if FCM is deferred)
- **Keep and adapt:**
  - `refreshAccessToken`: success saves token, 400 forces sign-out, 500 does not sign-out, network error does not sign-out
  - `signIn('local')`: success saves tokens + emits event, errors (400, 500, network) do not save tokens
  - `signOut`: clears tokens, emits event
  - Event lifecycle: `sign-in` triggers cache reset callback, `sign-out` triggers cleanup callback

### `TokenRefreshLink` (port from `apps/mobile/src/core/apollo/__tests__/link.test.ts`)

This is the most complex piece — an Apollo link that detects expired JWTs, queues concurrent operations during refresh, and propagates new tokens. The old test suite covers:

- **Anonymous requests:** pass through without auth header, retry on fetch/500 errors
- **Good token:** attaches Bearer header, retries on transient errors
- **Token expired locally** (JWT `exp` in the past): triggers refresh → retries query with new token, queues concurrent operations during refresh, force sign-out on refresh failure, clears tokens on sign-out
- **Token expired remotely** (server returns 401): errorLink sets context flag → triggers refresh → retries
- **Bad token** (server returns UNAUTHENTICATED): force sign-out without refresh attempt

Port as-is. These tests use `jsonwebtoken` to create real JWTs and `fetch-mock` to simulate backend responses.

### `useAuthSubmit` hook (port from `apps/mobile/src/screens/auth/useAuthSubmit.test.ts`)

Maps auth API responses to Formik form state. Worth testing because of the error-mapping logic:
- Success: calls `onSuccess` callback, sets `isSuccessful`
- API error: maps `error` object keys to Formik field errors with prefix
- Network error: sets generic `form.fetch_error`
- Always calls `setSubmitting(false)` in finally

### Password strength validation

Validate that `@zxcvbn-ts/core` integration works correctly with the Yup validation schemas used in Register and Reset screens. Specifically:
- Passwords below `PASSWORD_MIN_SCORE` (from `@whitewater-guide/commons`) fail validation
- Passwords meeting the threshold pass

---

## 5.9 — Validation checklist

- [ ] Can sign in with email/password against dev backend
- [ ] Can register new account
- [ ] Can request password reset
- [ ] Token refresh works on app resume
- [ ] Apollo cache persists across app restarts
- [ ] Unauthenticated users see auth screens
- [ ] Keyboard does not overlap form fields on any auth screen (iOS + Android)
- [ ] KeyboardToolbar prev/next navigates between inputs
- [ ] **Unit tests:** Auth service, TokenRefreshLink, useAuthSubmit, password strength validation
- [ ] **Detox E2E:** Full auth lifecycle, deep link to reset
