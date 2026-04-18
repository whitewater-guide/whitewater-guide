# Phase 9: User Features (Profile, Logbook, Descents, Add Section)

**Goal:** Authenticated user features complete — profile management, logbook list + descent detail, descent-form wizard, and add-section wizard.

**Scope constraints:**

- IAP / `PurchasesListView` is dropped entirely (handled via legacy removal).
- Social auth connect screens (CONNECT_EMAIL\*) stay as placeholders, not part of this phase.
- Chat (Matrix) stays deferred to Phase 12.

---

## Architectural decisions

### Form components come first (9.2)

Before any screen work, port the reusable field components. Every profile / logbook / descent-form / add-section screen composes these primitives. Implementing the screens first produces throwaway code that must be rewritten once fields land. The field components are also the pieces most useful in Storybook.

### Keyboard handling — `react-native-keyboard-controller` everywhere

Phase 5 already established the keyboard pattern for auth forms:

- Wrap app root with `KeyboardProvider` (already in [App.tsx](apps/mobile2/src/App.tsx)).
- Use `KeyboardAwareScrollView` from `react-native-keyboard-controller` for scrolling content.
- Use `KeyboardToolbar` to give users native prev/next/done buttons for multi-field forms.

Every form screen in this phase (register-like flows: main attributes tab, flows tab, descent-form-level) must wrap its scroll content in `KeyboardAwareScrollView` with a `bottomOffset` (35–50 px is a good default) so the focused input is always scrolled above the keyboard. For screens with a pinned "Next"/"Submit" button at the bottom, use `KeyboardStickyView` to lift the button above the keyboard, or render the button inside the scroll content.

**Rules:**

- Inputs must scroll into view on focus — do **not** rely on manual `onFocus` scrolling.
- Multi-line `TextField` with `fullHeight` must use `KeyboardAvoidingView` from `react-native-keyboard-controller` (not the RN built-in one) so the input resizes without the keyboard overlapping it.
- Add `KeyboardToolbar` at the screen root (sibling to `KeyboardAwareScrollView`) for any screen with 3+ text inputs.

### Form state — shared via root-level draft providers, **not** nested stacks

The legacy app nests an extra stack navigator under `ADD_SECTION_SCREEN` and `DESCENT_FORM` so that Formik state wraps the whole wizard and is shared across steps. This produces one unnecessary header transition and complicates deep-linking and nav param typing.

New design: each wizard's cross-screen state lives in a **draft provider** (React context + `useState`) mounted once at the app root (see §Provider placement below). Each step screen is a sibling at `RootStack` level and creates its own local Formik instance seeded from the draft. On "Next" each step commits its slice to the draft and navigates to the next step. The final step submits the draft to the server and clears it.

This matches React Navigation 7's recommended pattern for persistent context across a subset of screens: `Stack.Group` `screenLayout` **remounts per navigation** and so cannot host shared state; nesting a second navigator is the other alternative, but for this app a root-level provider is cleaner because the only reason the nested stacks existed was state sharing.

**Consequences:**

- No more `AddSectionStack` / `DescentFormStack` components.
- `navigation-params.ts` flattens: `AddSectionStackParamsList` and `DescentFormParamsList` merge into `RootStackParamsList`.
- Each step owns its header — set via `options` in `RootStack.tsx`.
- The existing [e2e/navigation](apps/mobile2/e2e/navigation/) tests that exercise `DESCENT_FORM_*` and `ADD_SECTION_*` screens keep the same testIDs; only the navigator containment changes.

### Provider placement

| Provider                       | Where                                                               | Why                                                                                                                            |
| ------------------------------ | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `DescentFormDraftProvider`     | [App.tsx](apps/mobile2/src/App.tsx) inside `AuthProvider`           | State must survive step navigation; only meaningful for authenticated users; light memory footprint.                           |
| `AddSectionDraftProvider`      | [App.tsx](apps/mobile2/src/App.tsx) inside `AuthProvider`           | Same rationale as descent-form draft.                                                                                          |
| `UploadsProvider`              | [App.tsx](apps/mobile2/src/App.tsx) inside `ApolloProvider`         | Needed by `PhotoUploadField` (used in AddSection main + photo screens, and future suggestion screen); uses Apollo upload link. |
| `ActionSheetProvider`          | already in [App.tsx](apps/mobile2/src/App.tsx)                      | Used by `VerificationStatus` menu.                                                                                             |
| `RadioDialogProvider` (legacy) | **dropped** — replaced by Paper `Menu` / Paper `Dialog` invocations | Consolidate on Paper; `MyLanguage` re-implemented directly with `Dialog`.                                                      |

After Phase 9, the provider stack in `App.tsx` looks like:

```
GestureHandlerRootView
└─ AppSettingsProvider
   └─ ActionSheetProvider
      └─ PaperProvider
         └─ KeyboardProvider
            └─ SafeAreaProvider
               └─ ApolloProvider
                  └─ UploadsProvider              ← NEW (9.6)
                     └─ TagsProvider
                        └─ AuthProvider
                           └─ DescentFormDraftProvider   ← NEW (9.5)
                              └─ AddSectionDraftProvider ← NEW (9.6)
                                 └─ I18nProvider
                                    └─ SnackbarProvider
                                       └─ NavigationRoot
```

The draft providers are no-ops (`null` `draft`, empty setters) when `me` is falsy, so they still render children but do not allocate meaningful state.

---

## 9.1 — Install dependencies

```bash
pnpm add --ignore-scripts formik @zxcvbn-ts/core @zxcvbn-ts/language-common
```

| Package                      | Status                              | Reason                                                |
| ---------------------------- | ----------------------------------- | ----------------------------------------------------- |
| `formik`                     | ⚠️ confirm v2.4+ is present         | Existing use in auth screens (Phase 5)                |
| `@zxcvbn-ts/core`            | ⚠️ present (Phase 5 password-field) | No change — already used                              |
| `@zxcvbn-ts/language-common` | ⚠️ present (Phase 5)                | No change — already used                              |
| `lodash`                     | ✅ installed                        | `times`, `memoize`, `identity`, `get` in form helpers |

Already installed in earlier phases (do not re-install):

- `@react-native-community/datetimepicker` (Phase 3) — used by `DatePicker`
- `react-native-image-picker` (Phase 3) — used by `PhotoUploadField` / `PhotoPicker`
- `@expo/react-native-action-sheet` (Phase 3) — used by `VerificationStatus`
- `react-native-keyboard-controller` (Phase 3) — used by every form screen

**Validation:** no native-code change here (all JS libs), but re-run `pnpm typecheck` from `apps/mobile2/` after install. Skip build.

---

## 9.2 — Form components (ported first)

All field components live in [src/forms/](apps/mobile2/src/forms/). Two of them already exist from Phase 5 (`TextField`, `HelperText`, `SuccessText`, `useReactNativeHandlers`, `password-field/*`). Port the remaining fields from [apps/mobile/src/forms/](apps/mobile/src/forms/).

### 9.2.1 — `useFocus` hook

Port from [apps/mobile/src/forms/useFocus.ts](apps/mobile/src/forms/useFocus.ts). Stable ref-forwarding helper used by every focusable field.

### 9.2.2 — `NumericField`

Port [apps/mobile/src/forms/NumericField.tsx](apps/mobile/src/forms/NumericField.tsx). Numeric text input using `strToFloat` (from `@whitewater-guide/clients`) with partial-numeric regex — accepts partial strings like `-` or `3.` while typing; commits to Formik as `number | null`.

**Changes from legacy:**

- Rewrite as a plain function with typed props (no `React.FC`, no `React.memo` unless profiling justifies).
- Replace `useFormikContext` + lodash `get` with `useField<number | null>` — cleaner, co-locates touched/error state.
- Keep the local string mirror state so partial input (`-`, `3.`) is not lost between renders.

### 9.2.3 — `CheckboxField`

Port [apps/mobile/src/forms/CheckboxField.tsx](apps/mobile/src/forms/CheckboxField.tsx) as-is. Paper `Checkbox` + `Paragraph`. Used in descent-form comment (`public`) and add-section attributes (`hidden`, `helpNeeded`).

### 9.2.4 — `RatingField` and `SimpleStarRating`

`SwipeableStarRating` is already ported in mobile2 ([components/SwipeableStarRating.tsx](apps/mobile2/src/components/SwipeableStarRating.tsx)). Wrap it in `RatingField` (Formik-aware) following [apps/mobile/src/forms/RatingField.tsx](apps/mobile/src/forms/RatingField.tsx). Write:

```
src/forms/RatingField.tsx
src/forms/RatingField.stories.tsx
```

### 9.2.5 — `ModalPickerField`

Port [apps/mobile/src/forms/modal-picker/](apps/mobile/src/forms/modal-picker/) — a list-in-a-modal picker for enum-ish values. Used for `difficulty` (decimal 0–6 in 0.5 steps) in AddSection main.

```
src/forms/modal-picker/ModalPickerField.tsx
src/forms/modal-picker/ModalPickerItem.tsx
src/forms/modal-picker/ModalPickerList.tsx
src/forms/modal-picker/index.ts
```

**Changes from legacy:**

- Use Paper v5 `Modal` / `Portal` / `Surface` — the API is stable but verify prop names.
- Generic type parameter `<V>` preserved.

### 9.2.6 — `PhotoUploadField`

Port [apps/mobile/src/forms/photo-upload/PhotoUploadField.tsx](apps/mobile/src/forms/photo-upload/PhotoUploadField.tsx). Depends on:

- `UploadsProvider` + `useLocalPhotos()` (port in 9.6.1 from [apps/mobile/src/features/uploads/](apps/mobile/src/features/uploads/)).
- `PhotoPicker` component (port from [apps/mobile/src/components/photo-picker/](apps/mobile/src/components/photo-picker/)) — wraps `react-native-image-picker` and renders a preview tile.

**Do not port `useImagePicker` as-is.** The legacy helper uses `launchImageLibrary` / `launchCamera` with callback; rewrite to `async/await` with `react-native-image-picker` v8 (already installed). Handle the "user cancelled" path silently; the "error" path surfaces through `trackError` + snackbar.

### 9.2.7 — `PasswordField` with `@zxcvbn-ts/core` strength indicator

✅ already done in Phase 5: [apps/mobile2/src/forms/password-field/](apps/mobile2/src/forms/password-field/). No changes here.

### 9.2.8 — `TagsField`

Port [apps/mobile/src/forms/TagsField.tsx](apps/mobile/src/forms/TagsField.tsx). Used by `AddSection/attributes` to select tags (`kayaking`, `rafting`, `kind`, etc). Depends on `TagsProvider` (already in app root).

### 9.2.9 — Storybook stories

Each form component gets a story. Because Formik is a context, every story wraps its component in a minimal **`FormikDecorator`** defined once and reused:

```
src/forms/__stories__/FormikDecorator.tsx
```

```tsx
// Simplified
export function FormikDecorator<T extends Record<string, unknown>>({
  initialValues,
  children,
}: PropsWithChildren<{ initialValues: T }>) {
  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      <View style={{ padding: 16 }}>{children}</View>
    </Formik>
  );
}
```

Where a field additionally needs other providers, stories compose them:

| Story                                   | Decorators needed                                                               |
| --------------------------------------- | ------------------------------------------------------------------------------- |
| `TextField.stories.tsx`                 | `FormikDecorator`                                                               |
| `NumericField.stories.tsx`              | `FormikDecorator`                                                               |
| `CheckboxField.stories.tsx`             | `FormikDecorator`                                                               |
| `RatingField.stories.tsx`               | `FormikDecorator`                                                               |
| `ModalPickerField.stories.tsx`          | `FormikDecorator` + `PaperProvider` (for Portal)                                |
| `PhotoUploadField.stories.tsx`          | `FormikDecorator` + `UploadsProvider` (mocked upload link via `MockedProvider`) |
| `TagsField.stories.tsx`                 | `FormikDecorator` + `TagsProvider` (mocked)                                     |
| `PasswordField.stories.tsx` (add)       | `FormikDecorator` (already partially exists)                                    |
| `PasswordStrengthIndicator.stories.tsx` | none (no Formik dep) — story with varying password strings                      |

**Story variants to cover for each field:** pristine, filled, touched-with-error, disabled (where applicable), multi-line (`TextField`), long-value truncation (`ModalPickerField`).

---

## 9.3 — My Profile screen

### Navigation

`MY_PROFILE` is already a `RootStack` screen. No change to screen registration; update the `component` reference.

Header: set in `RootStack` options — `headerTitle: t('drawer:myProfile')`. The screen itself adds a `headerRight` (three-dot menu) via `useLayoutEffect` + `navigation.setOptions`. See [8.3.x pattern in PHASE_8_SECTION_DETAIL.md] for the same per-screen `headerRight` mutation pattern.

### Files to port

From [apps/mobile/src/screens/my-profile/](apps/mobile/src/screens/my-profile/):

| Legacy file              | Target                                          | Notes                                                                                                              |
| ------------------------ | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `MyProfileScreen.tsx`    | `src/screens/my-profile/MyProfileScreen.tsx`    | Replace `useEffectOnce` with `useLayoutEffect`; keep `headerRight` menu setup.                                     |
| `MyProfileView.tsx`      | `src/screens/my-profile/MyProfileView.tsx`      | **Drop** `PurchasesListView`. Keep refresh control + sign-out button.                                              |
| `MyLanguage.tsx`         | `src/screens/my-profile/MyLanguage.tsx`         | Replace `RadioDialog` import with a local Paper `Dialog` + `RadioButton.Group` (RadioDialog lives only in legacy). |
| `SignOutButton.tsx`      | `src/screens/my-profile/SignOutButton.tsx`      | Port as-is.                                                                                                        |
| `VerificationStatus.tsx` | `src/screens/my-profile/VerificationStatus.tsx` | Port as-is. Uses `useActionSheet` (already wired in App.tsx).                                                      |
| `updateProfile.gql`      | `src/screens/my-profile/updateProfile.gql`      | Port as-is — codegen regenerates `.generated.ts`.                                                                  |
| `menu/` (MyProfileMenu)  | `src/screens/my-profile/menu/`                  | Port — it's the three-dot `Appbar.Action` opening an `Appbar.ActionMenu`.                                          |
| `purchases/`             | **drop**                                        | IAP removed.                                                                                                       |

### MyProfileView structure (no changes from legacy)

```
ScrollView (refresh control)
├── Paper (user header)
│   ├── Title (name) + VerificationStatus
│   └── Caption (email)
└── Paper
    ├── Title "General"
    ├── Divider
    └── MyLanguage (RadioDialog → Paper.Dialog)
SignOutButton (pinned below ScrollView)
```

### Providers used

| Provider         | Usage                                                        |
| ---------------- | ------------------------------------------------------------ |
| `AuthProvider`   | `useAuth()` → `me`, `service`, `refreshProfile`              |
| `ApolloProvider` | `useUpdateProfileMutation` for language edit                 |
| `ActionSheet`    | `useActionSheet()` in `VerificationStatus` (already wrapped) |

All three already live in the app root provider stack. No new providers.

### Stories

```
src/screens/my-profile/MyProfileView.stories.tsx              # variants: verified, unverified, no-email
src/screens/my-profile/VerificationStatus.stories.tsx         # variants: verified, unverified
src/screens/my-profile/MyLanguage.stories.tsx                 # variants: en active, ru active, default en
```

Each story wraps children in an **`AuthContext.Provider`** (inline) with a `MOCK_USER` fixture (already exported from `src/core/auth/MockAuthService.ts`, re-used from `RegionCard.stories.tsx`). Use `MockedProvider` for the `updateProfile` mutation.

### Validation

- [ ] My Profile loads with `me` data; refresh control re-fetches profile.
- [ ] Language picker changes `me.language`; optimistic update.
- [ ] Sign out shows confirmation dialog, then signs out and nav resets to regions list.
- [ ] Verification status renders the correct icon + label; `requestVerification` triggers action sheet.
- [ ] **Unit tests:** `MyLanguage` change calls `updateProfile` with correct variables.
- [ ] **Storybook:** all three stories render in smoke-test mode.

---

## 9.4 — Logbook screens

### Navigation investigation

Legacy screens: `LOGBOOK` (list) + `DESCENT` (detail). Currently mocked at `RootStack` level — see [RootStack.tsx:136–148](apps/mobile2/src/core/navigation/RootStack.tsx#L136-L148). **Already flat** — no nested stack involved. Only swap the mock components for real ones.

Header: `LOGBOOK` has `headerTitle: t('drawer:logbook')` set at RootStack level. `DESCENT` screen dynamically sets `headerRight: <DescentMenu descent={descent} />` via `navigation.setOptions` once data loads.

### Drawer swipe gesture

Legacy `LogbookScreen` enables drawer swipe with `useFocusEffect` ⟶ `navigation.getParent()?.setOptions({ swipeEnabled: true })`. Keep the same pattern in mobile2 — the `RootDrawer` must expose `swipeEnabled` override. Confirm that [RootDrawer.tsx](apps/mobile2/src/core/navigation/RootDrawer.tsx) accepts the option; if not, add it.

### 9.4.1 — Logbook list (`LOGBOOK`)

Port from [apps/mobile/src/screens/logbook/](apps/mobile/src/screens/logbook/):

| Legacy file           | Target                                              |
| --------------------- | --------------------------------------------------- |
| `LogbookScreen.tsx`   | `src/screens/logbook/LogbookScreen.tsx`             |
| `LogbookView.tsx`     | merge into `LogbookScreen.tsx` — single-use wrapper |
| `LogbookList.tsx`     | `src/screens/logbook/LogbookList.tsx`               |
| `LogbookListItem.tsx` | `src/screens/logbook/LogbookListItem.tsx`           |
| `LogbookEmpty.tsx`    | `src/screens/logbook/LogbookEmpty.tsx`              |
| `AddDescentFAB.tsx`   | `src/screens/logbook/AddDescentFAB.tsx`             |
| `myDescents.gql`      | `src/screens/logbook/myDescents.gql`                |
| `useMyDescents.ts`    | `src/screens/logbook/useMyDescents.ts`              |

**Changes from legacy:**

- Replace `FlatList` with `@shopify/flash-list` `FlashList` (consistent with Phase 6) — `getItemLayout` becomes `estimatedItemSize`.
- Drop `getHeaderRenderer` calls inside screen — header is set by RootStack options.

### 9.4.2 — Descent detail (`DESCENT`)

Port from [apps/mobile/src/screens/descent/](apps/mobile/src/screens/descent/):

| Legacy file               | Target                                        |
| ------------------------- | --------------------------------------------- |
| `DescentScreen.tsx`       | `src/screens/descent/DescentScreen.tsx`       |
| `DescentInfo.tsx`         | `src/screens/descent/DescentInfo.tsx`         |
| `DescentMenu.tsx`         | `src/screens/descent/DescentMenu.tsx`         |
| `DescentNotFound.tsx`     | `src/screens/descent/DescentNotFound.tsx`     |
| `DeleteDescentDialog.tsx` | `src/screens/descent/DeleteDescentDialog.tsx` |
| `useDescentDetails.ts`    | `src/screens/descent/useDescentDetails.ts`    |
| `useDeleteDescent.ts`     | `src/screens/descent/useDeleteDescent.ts`     |
| `useNavigateToForm.ts`    | `src/screens/descent/useNavigateToForm.ts`    |
| `descentDetails.gql`      | `src/screens/descent/descentDetails.gql`      |
| `deleteDescent.gql`       | `src/screens/descent/deleteDescent.gql`       |

`DescentMenu` renders a Paper `Menu` with "Edit" and "Delete" items. Edit navigates to `DESCENT_FORM` with `descentId`. Delete opens `DeleteDescentDialog` which calls `useDeleteDescent` and navigates back.

### Providers used

| Provider         | Usage                                                  |
| ---------------- | ------------------------------------------------------ |
| `AuthProvider`   | `me.id` for `myDescents` query variables               |
| `ApolloProvider` | `useMyDescentsQuery`, `useDescentDetailsQuery`, delete |

Both already in root stack.

### Stories

```
src/screens/logbook/LogbookListItem.stories.tsx     # variants: normal, no-section, long-comment
src/screens/logbook/LogbookEmpty.stories.tsx        # variant: default
src/screens/descent/DescentInfo.stories.tsx         # variants: full, public, private, with-level, no-level
src/screens/descent/DeleteDescentDialog.stories.tsx # variant: open
```

Wrap screen-level stories in `MockedProvider` + `AuthContext.Provider` + a `NavigationContainer` decorator (same pattern as `RegionCard.stories.tsx`).

### Validation

- [ ] Logbook list renders user's descents in reverse-chronological order.
- [ ] Pull-to-refresh works; pagination (`loadMore`) works.
- [ ] Empty state shows on new users.
- [ ] Descent detail loads via route param; shows section, date, level, comment.
- [ ] Menu → Delete opens dialog → confirm → descent removed from list; back navigation returns to list.
- [ ] Menu → Edit navigates to `DESCENT_FORM` with `descentId`.
- [ ] **Unit tests:** `useDeleteDescent` removes item from cache; `useMyDescents` pagination.
- [ ] **Detox E2E:** create stub descent (via MSW/mock) → open logbook → tap item → verify detail → back.

---

## 9.5 — Descent Form wizard

### Navigation investigation — flatten to `RootStack`

Legacy: `DESCENT_FORM` is a single RootStack screen whose component (`DescentFormScreen`) wraps a nested `StackNavigator` (`DescentFormStack`) with 4 child screens (`DESCENT_FORM_SECTION`, `DESCENT_FORM_DATE`, `DESCENT_FORM_LEVEL`, `DESCENT_FORM_COMMENT`).

Current mobile2: same pattern with mock screens — see [DescentFormStack.tsx](apps/mobile2/src/screens/descent-form/DescentFormStack.tsx).

**Plan:** remove the nested stack. Lift all four step screens to `RootStack`:

```diff
 RootStack (NativeStack)
 ├─ ... other screens
-├─ DESCENT_FORM → DescentFormStack (wraps nested navigator + Formik)
+├─ DESCENT_FORM_SECTION → DescentFormSectionScreen
+├─ DESCENT_FORM_DATE    → DescentFormDateScreen
+├─ DESCENT_FORM_LEVEL   → DescentFormLevelScreen
+├─ DESCENT_FORM_COMMENT → DescentFormCommentScreen
```

Remove `DESCENT_FORM` from `Screens` enum and `navigation-params.ts`. Entry points that used to push `DESCENT_FORM` (logbook FAB, descent edit menu) push `DESCENT_FORM_SECTION` instead — or `DESCENT_FORM_LEVEL` directly when editing and the section is known.

### Headers

Each step owns its header in `RootStack.tsx` `options`:

| Screen                 | `headerTitle`                                  | Extra                                                                                                             |
| ---------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `DESCENT_FORM_SECTION` | `t('screens:descentForm.section.headerTitle')` | `headerLeft` back button closes entire wizard (pop to origin) — custom `headerBackVisible` + custom `headerLeft`. |
| `DESCENT_FORM_DATE`    | `t('screens:descentForm.date.headerTitle')`    | Default back button to `SECTION`.                                                                                 |
| `DESCENT_FORM_LEVEL`   | `t('screens:descentForm.level.headerTitle')`   | Default back.                                                                                                     |
| `DESCENT_FORM_COMMENT` | `t('screens:descentForm.comment.headerTitle')` | Default back.                                                                                                     |

Use `innerScreenOptions` from `RootStack.tsx` (already defined) as the base, overriding `headerTitle` per screen.

### State — `DescentFormDraftProvider`

Mount in [App.tsx](apps/mobile2/src/App.tsx) inside `AuthProvider`. Shape:

```tsx
// src/screens/descent-form/DescentFormDraftContext.tsx
interface DescentFormDraft {
  draft: Partial<DescentFormData>;
  setDraft: (
    updater: (prev: Partial<DescentFormData>) => Partial<DescentFormData>,
  ) => void;
  resetDraft: () => void;
  prefillFromDescent: (descent: DescentDetails) => void;
  loading: boolean; // true while prefillFromDescent runs
}
```

On mount, `DescentFormDraftProvider` holds `draft = {}`. The first step navigated to calls `prefillFromDescent` when the user is editing (`descentId` route param) — that fetch runs once and populates the draft.

On final-step submit success (`useUpsertDescent` resolves), the provider calls `resetDraft()`.

**Why root-level?** Because `Stack.Group.screenLayout` remounts per navigation (confirmed — see "Architectural decisions" §Form state). A root-level provider is stateful across all step transitions.

**Re-entry from background:** Nav state persists (`usePersistence` already in place). If the user backgrounds on step 3 and returns, nav state lands them back on step 3. The draft provider rehydrates its in-memory state from MMKV on every app start (keyed by `descentFormDraft:${userId}`), so the draft survives app kills.

### Files

From [apps/mobile/src/screens/descent-form/](apps/mobile/src/screens/descent-form/), port:

| Legacy file                            | Target                                                                                                                 |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `types.ts`                             | `src/screens/descent-form/types.ts` (already partial)                                                                  |
| `useInitialDescent.ts`                 | fold into `DescentFormDraftProvider` as `prefillFromDescent`                                                           |
| `useUpsertDescent.ts`                  | `src/screens/descent-form/useUpsertDescent.ts`                                                                         |
| `upsertDescent.gql` / `getDescent.gql` | `src/screens/descent-form/*.gql`                                                                                       |
| `section/DescentFormSectionScreen.tsx` | `src/screens/descent-form/section/DescentFormSectionScreen.tsx`                                                        |
| `section/SectionSearch.tsx` + children | `src/screens/descent-form/section/`                                                                                    |
| `date/DescentFormDateScreen.tsx`       | `src/screens/descent-form/date/DescentFormDateScreen.tsx`                                                              |
| `date/DatePicker.tsx`                  | `src/screens/descent-form/date/DatePicker.tsx`                                                                         |
| `date/DatePickerDialog.tsx`            | `src/screens/descent-form/date/DatePickerDialog.tsx`                                                                   |
| `level/DescentFormLevelScreen.tsx`     | `src/screens/descent-form/level/DescentFormLevelScreen.tsx`                                                            |
| `level/DescentFormLevelView.tsx`       | merge into screen                                                                                                      |
| `level/chart/`                         | **drop** — reuse `ChartLayout` from [components/chart/](apps/mobile2/src/components/chart/) (already built in Phase 8) |
| `comment/DescentFormCommentScreen.tsx` | `src/screens/descent-form/comment/DescentFormCommentScreen.tsx`                                                        |
| `comment/DescentFormCommentView.tsx`   | merge into screen                                                                                                      |
| `DescentFormContext.tsx`               | **drop** — replaced by `DescentFormDraftProvider`                                                                      |
| `DescentFormScreen.tsx`                | **drop** — no wrapper screen needed                                                                                    |
| `DescentFormStack.tsx`                 | **drop**                                                                                                               |

### Per-step form pattern

Each step screen creates a **local Formik** seeded from the draft, validates its slice, and on "Next" commits its slice back to the draft before navigating:

```tsx
// DescentFormDateScreen (simplified)
function DescentFormDateScreen({ navigation }) {
  const { draft, setDraft } = useDescentFormDraft();
  const schema = useMemo(() => DescentFormDateSchema, []);
  return (
    <Formik
      initialValues={{
        startedAt: draft.startedAt ?? defaultStartedAt(draft.section),
      }}
      validationSchema={schema}
      onSubmit={(values) => {
        setDraft((prev) => ({ ...prev, ...values }));
        navigation.navigate(Screens.DESCENT_FORM_LEVEL);
      }}
    >
      <DescentFormDateBody />
    </Formik>
  );
}
```

The comment step is the terminal submit — its `onSubmit` commits the slice, then calls `useUpsertDescent()` with the full merged draft, then `resetDraft()` and navigates back to logbook (or to the new descent detail).

Validation schemas come from [packages/validation/](packages/validation/). The full-form schema (cross-field) stays in the package; per-step schemas are subsets of it, exported alongside.

### Keyboard handling

- **Section step:** uses a `FlatList`/`FlashList`-based search. Wrap input in `KeyboardAvoidingView` from `react-native-keyboard-controller` (behavior `"translate-with-padding"`). No `KeyboardToolbar` — single input.
- **Date step:** uses `DatePickerDialog` (native picker opens modal) — keyboard does not interfere; no wrapping needed.
- **Level step:** two text inputs (`level.value`, `level.unit`) + chart below. Use `KeyboardAwareScrollView` with `bottomOffset={35}` — inputs scroll into view above keyboard. Chart re-positions below.
- **Comment step:** single `multiline` `TextField` with `fullHeight`, plus `CheckboxField` and submit button. Use `KeyboardAvoidingView` (not `KeyboardAwareScrollView`, because the multiline field takes the full height). The `Submit` button sits at the bottom; with `KeyboardAvoidingView`, it lifts above the keyboard. Add `KeyboardToolbar` with `Done` to dismiss the keyboard from inside the multiline input.

### Providers used

| Provider                         | Usage                                             |
| -------------------------------- | ------------------------------------------------- |
| `DescentFormDraftProvider` (NEW) | Cross-step draft state                            |
| `AuthProvider`                   | Gate access; `me.id` for queries                  |
| `ApolloProvider`                 | Section search, upsert/delete, chart measurements |
| `I18nProvider`                   | `useTranslation`                                  |
| `SnackbarProvider`               | Success/error toasts on submit                    |

### Stories

```
src/screens/descent-form/section/SectionSearch.stories.tsx         # variants: empty, results, loading
src/screens/descent-form/date/DatePicker.stories.tsx               # variants: default, with-timezone
src/screens/descent-form/date/DatePickerDialog.stories.tsx
src/screens/descent-form/level/DescentFormLevelScreen.stories.tsx  # variants: with-gauge, without-gauge
src/screens/descent-form/comment/DescentFormCommentScreen.stories.tsx
```

Story decorators: `FormikDecorator` seeded with partial draft + `NavigationContainer` + `MockedProvider` + `DescentFormDraftProvider` (real, but initialized with a fixture). Section search additionally needs Apollo mocks for `findSections`.

### Validation

- [ ] Wizard launches from logbook FAB → lands on section step.
- [ ] Picking a section advances to date step; selected section persists.
- [ ] Date step pre-fills with sensible default (now, section timezone).
- [ ] Level step shows chart (when section has gauge) and auto-fills from latest measurement.
- [ ] Comment step submits; new descent appears in logbook.
- [ ] Editing an existing descent pre-fills all four steps.
- [ ] Backgrounding mid-wizard and returning preserves both nav position and draft data.
- [ ] **Unit tests:** `DescentFormDraftProvider` setDraft/resetDraft, `useUpsertDescent` success + error paths.
- [ ] **Detox E2E:** logbook FAB → section → date → level → comment → submit → verify descent in list.

---

## 9.6 — Add Section wizard

### Navigation investigation — flatten, keep the tabs

Legacy: `ADD_SECTION_SCREEN` is a RootStack screen whose component wraps `Formik` + `AddSectionRegionProvider` + a nested `StackNavigator` (`AddSectionStack`) with:

- `ADD_SECTION_TABS` (a `MaterialTopTab` navigator with 5 tabs: MAIN, ATTRIBUTES, DESCRIPTION, FLOWS, PHOTOS)
- `ADD_SECTION_RIVER`
- `ADD_SECTION_GAUGE`
- `ADD_SECTION_SHAPE`
- `ADD_SECTION_PHOTO` (edit individual photo metadata)

Current mobile2: [AddSectionStack.tsx](apps/mobile2/src/screens/add-section/AddSectionStack.tsx) mirrors this.

**Plan:** remove `ADD_SECTION_SCREEN` wrapper + `AddSectionStack`. Lift all RootStack inner screens directly. The tabs navigator stays — it must stay nested because tabs cannot be flattened (swipe-between-tabs is a single screen at the parent level).

```diff
 RootStack (NativeStack)
 ├─ ... other screens
-├─ ADD_SECTION_SCREEN → AddSectionStack (wraps Formik + nested native stack + 5 sibling screens)
+├─ ADD_SECTION_TABS   → AddSectionTabsScreen (renders MaterialTopTab navigator with 5 tabs)
+├─ ADD_SECTION_RIVER  → RiverScreen
+├─ ADD_SECTION_GAUGE  → GaugeScreen
+├─ ADD_SECTION_SHAPE  → ShapeScreen
+├─ ADD_SECTION_PHOTO  → PhotoScreen
```

Remove `ADD_SECTION_SCREEN` from `Screens` enum, `AddSectionStackParamsList` type, and add `ADD_SECTION_PHOTO` params (`{ index, localPhotoId }`) to `RootStackParamsList`.

### Headers

All five screens use `innerScreenOptions` from `RootStack.tsx`. Titles:

| Screen              | `headerTitle`                         | Extra                                                                                                        |
| ------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `ADD_SECTION_TABS`  | `t('screens:addSection.headerTitle')` | `headerRight: <SubmitButton />` (submits the full form)                                                      |
| `ADD_SECTION_RIVER` | `t('screens:addSection.river.title')` | default back                                                                                                 |
| `ADD_SECTION_GAUGE` | `t('screens:addSection.gauge.title')` | default back                                                                                                 |
| `ADD_SECTION_SHAPE` | `t('screens:addSection.shape.title')` | default back; `SHAPE` screen sets its own `headerRight: <DoneButton />` via `setOptions` when state is valid |
| `ADD_SECTION_PHOTO` | `t('screens:addSection.photo.title')` | set its own `headerLeft: null` and `headerRight: <BackButton />` (legacy behavior)                           |

### State — `AddSectionDraftProvider` + region context

Mount in [App.tsx](apps/mobile2/src/App.tsx) inside `AuthProvider`. Two responsibilities:

1. **Full section form draft** (`Partial<SectionFormInput>`) — survives step navigation, survives app restarts (MMKV-persisted).
2. **Source region** (`{ id, name }` | null) — set once when user enters the wizard, exposed via `useAddSectionRegion()`. This replaces the legacy `AddSectionRegionProvider`.

```tsx
// src/screens/add-section/AddSectionDraftContext.tsx
interface AddSectionDraft {
  draft: Partial<SectionFormInput>;
  setDraft: (
    u: (prev: Partial<SectionFormInput>) => Partial<SectionFormInput>,
  ) => void;
  resetDraft: () => void;

  region: { id: string; name: string } | null;
  setRegion: (r: { id: string; name: string } | null) => void;
}
```

### Form instance — single Formik, wraps tabs

Because all 5 tabs share form state AND users interact with multiple tabs before submitting, a single `Formik` instance must wrap the entire tabs screen. Mount Formik inside `AddSectionTabsScreen`, seeded from `draft`:

```tsx
// src/screens/add-section/AddSectionTabsScreen.tsx
function AddSectionTabsScreen() {
  const { draft, setDraft } = useAddSectionDraft();
  const initialValues = useMemo(() => buildInitialValues(draft), [draft.id]); // stable unless descentId changes
  return (
    <Formik<SectionFormInput>
      initialValues={initialValues}
      validate={validator}
      validateOnMount
      onSubmit={useAddSection()} // in-flight draft → mutation, resets draft on success
    >
      <FormikToDraftSync />{' '}
      {/* subscribes to values, writes back to draft on change (debounced) */}
      <AddSectionTabs />
    </Formik>
  );
}
```

The four sibling screens (RIVER, GAUGE, SHAPE, PHOTO) are **not** inside this Formik. When the user navigates from the Main tab to River, RIVER is a separate RootStack screen: it reads from and writes to `draft.river` (via `useAddSectionDraft`) directly, then `navigation.goBack()` returns to the tabs, where `buildInitialValues(draft)` re-seeds Formik if needed.

Alternatively (simpler): RIVER/GAUGE/SHAPE/PHOTO modify Formik state by calling back up through the draft. Since Formik re-seeds from `draft` only if `initialValues` reference changes, updating a slice of `draft` and then returning to the tabs requires a controlled re-seed — use `enableReinitialize` on Formik with a ref-stable `initialValues` tied to a `draft.version` counter bumped by inner screens.

**Final design:** only the Main/Attributes/Description/Flows/Photos tabs are inside Formik. Inner screens write to the draft provider; when an inner screen returns via `goBack()`, the `FormikToDraftSync` sibling component (mounted next to tabs) reads the latest draft and applies any changes via `setFieldValue`. This avoids re-seeding the entire form.

### Files

From [apps/mobile/src/screens/add-section/](apps/mobile/src/screens/add-section/):

| Legacy path             | Target                                             | Notes                                                     |
| ----------------------- | -------------------------------------------------- | --------------------------------------------------------- |
| `context.tsx`           | fold into `AddSectionDraftProvider`                | Region state now in draft provider                        |
| `AddSectionScreen.tsx`  | `src/screens/add-section/AddSectionTabsScreen.tsx` | Remove SafeAreaView wrapping; provider is app-root        |
| `AddSectionTabs.tsx`    | `src/screens/add-section/AddSectionTabs.tsx`       | Already exists (mock); swap to real tab screens           |
| `AddSectionStack.tsx`   | **drop**                                           |                                                           |
| `useAddSection.ts`      | `src/screens/add-section/useAddSection.ts`         | Port; resets draft on success                             |
| `formToInput.ts`        | `src/screens/add-section/formToInput.ts`           | Port as-is                                                |
| `validation.ts`         | `src/screens/add-section/validation.ts`            | Port as-is                                                |
| `resetToDescentForm.ts` | `src/screens/add-section/resetToDescentForm.ts`    | Port — updates nav to return to descent form with section |
| `SubmitButton.tsx`      | `src/screens/add-section/SubmitButton.tsx`         | `Appbar.Action` inside Formik context                     |
| `addSection.gql`        | `src/screens/add-section/addSection.gql`           | Port as-is                                                |
| `main/`                 | `src/screens/add-section/main/`                    | Port `MainScreen`, `PiToPlaceholder`, `RiverPlaceholder`  |
| `attributes/`           | `src/screens/add-section/attributes/`              | Port `AttributesScreen` + `season/` subdirectory          |
| `description/`          | `src/screens/add-section/description/`             | Port `DescriptionScreen`                                  |
| `flows/`                | `src/screens/add-section/flows/`                   | Port `FlowsScreen` + `GaugePlaceholder`                   |
| `photos/`               | `src/screens/add-section/photos/`                  | Port `PhotosScreen` + `AddPhotoButton` + `PhotoThumb`     |
| `river/`                | `src/screens/add-section/river/`                   | Port `RiverScreen` + rivers search                        |
| `gauge/`                | `src/screens/add-section/gauge/`                   | Port `GaugeScreen` + rivers search + create-gauge dialog  |
| `shape/`                | `src/screens/add-section/shape/`                   | Port `ShapeScreen` + `PiToMap` + `PiToControl` + state    |
| `photo/`                | `src/screens/add-section/photo/`                   | Port `PhotoScreen` + `SectionPhotoForm` + `BackButton`    |
| `utils/`                | `src/screens/add-section/utils/`                   | Port helpers                                              |

Replace `KeyboardAwareScrollView` (from `react-native-keyboard-aware-scroll-view`) and the `listenToKeyboardEvents(ScrollView)` hack in `FlowsScreen` with `KeyboardAwareScrollView` from `react-native-keyboard-controller`. Remove the awkward `displayName` re-assignment.

### Keyboard handling per tab

| Tab / screen    | Input layout                                                 | Handling                                                                  |
| --------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------- |
| **Main**        | name, difficulty (modal), difficultyXtra, Pi-To placeholders | `KeyboardAwareScrollView` + `KeyboardToolbar` (2 inputs)                  |
| **Attributes**  | rating, tags, season (numeric range), hidden, helpNeeded     | `KeyboardAwareScrollView`; `TagsField` opens modal, no keyboard overlap   |
| **Description** | single `multiline` `TextField` fullHeight                    | `KeyboardAvoidingView` `behavior="padding"` + `KeyboardToolbar` with Done |
| **Flows**       | ~12 NumericFields + 2 TextFields                             | `KeyboardAwareScrollView` + `KeyboardToolbar` (essential; many inputs)    |
| **Photos**      | grid, no text input                                          | n/a                                                                       |
| **River**       | search input + list                                          | `KeyboardAvoidingView` around search bar; list scrolls freely             |
| **Gauge**       | search input + list + create dialog                          | `KeyboardAvoidingView`; dialog uses Paper `Dialog` (built-in avoidance)   |
| **Shape**       | map with PiTo controls                                       | n/a                                                                       |
| **Photo**       | caption `TextField` + copyright/license + photo              | `KeyboardAwareScrollView` + `KeyboardToolbar`                             |

### Providers used

| Provider                        | Usage                                                  |
| ------------------------------- | ------------------------------------------------------ |
| `AddSectionDraftProvider` (NEW) | Cross-screen draft + region state                      |
| `UploadsProvider` (NEW)         | `PhotoUploadField` / `PhotosScreen` photo upload queue |
| `AuthProvider`                  | Access gate + `me.id`                                  |
| `ApolloProvider`                | Rivers search, gauges search, `addSection` mutation    |
| `TagsProvider`                  | Tag picker options                                     |
| `SnackbarProvider`              | Success / error toasts                                 |

### Stories

```
src/screens/add-section/main/MainScreen.stories.tsx                  # empty, prefilled, error
src/screens/add-section/attributes/AttributesScreen.stories.tsx
src/screens/add-section/description/DescriptionScreen.stories.tsx
src/screens/add-section/flows/FlowsScreen.stories.tsx                # critical — many NumericFields
src/screens/add-section/photos/PhotosScreen.stories.tsx
src/screens/add-section/photos/PhotoThumb.stories.tsx                # states: uploading, ready, error
src/screens/add-section/river/RiversListItem.stories.tsx
src/screens/add-section/gauge/GaugesListItem.stories.tsx
src/screens/add-section/shape/PiToControl.stories.tsx
src/screens/add-section/photo/SectionPhotoForm.stories.tsx
```

Story decorators: `FormikDecorator` (seeded with a rich fixture covering every field) + `AddSectionDraftProvider` + `TagsProvider` (mocked) + `UploadsProvider` (mocked upload link) + `MockedProvider` (for river/gauge search queries) + `NavigationContainer`.

Write **one combined decorator** `AddSectionStoryDecorator` that stacks all of these, then each story just imports and applies it.

### Validation

- [ ] Wizard launches from descent form "Add section" link with source region pre-populated.
- [ ] Main tab edit round-trips to draft; switching tabs preserves edits.
- [ ] Flows tab: all numeric fields + formula fields validate; errors show inline.
- [ ] Photos tab: can add photo via picker, see thumbnail, upload progress, open individual photo screen to edit caption, mark for delete.
- [ ] River / Gauge / Shape modal screens return to correct tab and apply changes.
- [ ] Submit button calls `addSection` mutation; success toast + nav return; error surfaces in correct field(s).
- [ ] Backgrounding mid-wizard preserves draft.
- [ ] Sign-out clears draft.
- [ ] **Unit tests:** `formToInput` mapping, `SectionFormSchema` validation rules, `AddSectionDraftProvider` persistence + reset on sign-out.
- [ ] **Detox E2E:** open descent-form → "add section" → fill required fields across tabs → submit → return to descent-form with new section selected.

---

## 9.7 — Final validation

- [ ] Profile loads and edits save to backend
- [ ] Logbook displays descents correctly
- [ ] Can create, view, and delete a descent
- [ ] Descent form navigates through all steps and persists across restarts
- [ ] Add Section wizard works end-to-end
- [ ] Keyboard handling: on every form screen, focused input is visible above the keyboard
- [ ] **Unit tests:** form validation, descent CRUD, draft-provider persistence
- [ ] **Storybook:** all form field components, password strength indicator, Main/Flows/Photos tabs, LogbookListItem, DescentInfo, VerificationStatus render
- [ ] **Detox E2E:** edit profile → create descent → view in logbook → delete; plus descent form → add section → submit
- [ ] `pnpm tsc --noEmit` clean from `apps/mobile2/`
- [ ] `pnpm react-native build-ios` + `pnpm react-native build-android` both green (no new native deps expected; re-verify if something was added)
