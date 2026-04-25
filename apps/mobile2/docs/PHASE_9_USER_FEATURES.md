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

### Validation

- [ ] My Profile loads with `me` data; refresh control re-fetches profile.
- [ ] Language picker changes `me.language`; optimistic update.
- [ ] Sign out shows confirmation dialog, then signs out and nav resets to regions list.
- [ ] Verification status renders the correct icon + label; `requestVerification` triggers action sheet.

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

### Validation

- [x] Logbook list renders user's descents in reverse-chronological order.
- [x] Pull-to-refresh works; pagination (`loadMore`) works.
- [x] Empty state shows on new users.
- [x] Descent detail loads via route param; shows section, date, level, comment.
- [x] Menu → Delete opens dialog → confirm → descent removed from list; back navigation returns to list.
- [x] Menu → Edit navigates to `DESCENT_FORM` with `descentId`.

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

### Validation

- [ ] Wizard launches from logbook FAB → lands on section step.
- [ ] Picking a section advances to date step; selected section persists.
- [ ] Date step pre-fills with sensible default (now, section timezone).
- [ ] Level step shows chart (when section has gauge) and auto-fills from latest measurement.
- [ ] Comment step submits; new descent appears in logbook.
- [ ] Editing an existing descent pre-fills all four steps.
- [ ] Backgrounding mid-wizard and returning preserves both nav position and draft data.

---

## 9.6 — Add Section wizard

### Architectural overview

Legacy: `ADD_SECTION_SCREEN` is a RootStack screen whose component wraps `Formik` + `AddSectionRegionProvider` + a nested `StackNavigator` (`AddSectionStack`) with:

- `ADD_SECTION_TABS` (a `MaterialTopTab` navigator with 5 tabs: MAIN, ATTRIBUTES, DESCRIPTION, FLOWS, PHOTOS)
- `ADD_SECTION_RIVER`
- `ADD_SECTION_GAUGE`
- `ADD_SECTION_SHAPE`
- `ADD_SECTION_PHOTO` (edit individual photo metadata)

**Plan:** remove `ADD_SECTION_SCREEN` wrapper + `AddSectionStack`. Lift all screens directly into `RootStack`. The tabs navigator stays nested (swipe-between-tabs is a single parent-level screen).

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

Remove `ADD_SECTION_SCREEN` from `Screens` enum and `RootStackParamsList`. Remove `AddSectionStackParamsList`. Add `ADD_SECTION_PHOTO` params (`{ index: number; localPhotoId: string }`) to `RootStackParamsList`.

### Headers

All five screens use `innerScreenOptions` from `RootStack.tsx`. Titles:

| Screen              | `headerTitle`                         | Extra                                                                                                        |
| ------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `ADD_SECTION_TABS`  | `t('screens:addSection.headerTitle')` | `headerRight: <SubmitButton />` (submits the full form)                                                      |
| `ADD_SECTION_RIVER` | `t('screens:addSection.river.title')` | default back                                                                                                 |
| `ADD_SECTION_GAUGE` | `t('screens:addSection.gauge.title')` | default back                                                                                                 |
| `ADD_SECTION_SHAPE` | `t('screens:addSection.shape.title')` | default back; `SHAPE` screen sets its own `headerRight: <DoneButton />` via `setOptions` when state is valid |
| `ADD_SECTION_PHOTO` | `t('screens:addSection.photo.title')` | sets its own `headerLeft: null` and `headerRight: <BackButton />` (legacy behavior)                          |

### State — `AddSectionDraftProvider` + region context

Mount in [App.tsx](apps/mobile2/src/App.tsx) inside `AuthProvider` (alongside `DescentFormDraftProvider`). Also add `UploadsProvider` inside `ApolloProvider`. Two responsibilities:

1. **Full section form draft** (`Partial<SectionFormInput>`) — survives step navigation.
2. **Source region** (`{ id: string; name: string } | null`) — set once when user enters the wizard. Replaces the legacy `AddSectionRegionProvider`.

### Form instance — single Formik wrapping tabs

A single `Formik` instance mounts inside `AddSectionTabsScreen`, seeded from draft. A `FormikToDraftSync` sibling component (rendered inside Formik, next to `<AddSectionTabs />`) subscribes to `values` and writes back to the draft provider on change (debounced). This keeps the draft in sync so that the inner screens (RIVER/GAUGE/SHAPE/PHOTO) — which are separate RootStack screens outside Formik — can read/write slices of the draft directly. When they return via `goBack()`, the `AddSectionTabsScreen` uses `useFocusEffect` to re-read updated draft slices and call `setFieldValue` for the changed fields (`river`, `gauge`, `shape`, `media`).

Provider stack after 9.6:

```
ApolloProvider
└─ UploadsProvider        ← NEW (9.6.1)
   └─ TagsProvider
      └─ AuthProvider
         └─ DescentFormDraftProvider
            └─ AddSectionDraftProvider  ← NEW (9.6.1)
               └─ ...
```

---

## 9.6.1 — Scaffold: nav flatten, providers, types, Formik shell

**Goal:** navigation compiles, wizard is navigable end-to-end with real tabs but placeholder tab bodies. No real tab content yet.

### Files to create / modify

| Action   | File                                                                  | Notes                                                                    |
| -------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Create   | `src/screens/add-section/AddSectionDraftContext.tsx`                  | Provider + `useAddSectionDraft()` hook; region state folded in           |
| Create   | `src/screens/add-section/types.ts`                                    | `SectionFormInput`, `MediaFormInput`, param types (no `AddSectionStack`) |
| Create   | `src/screens/add-section/validation.ts`                               | Port `SectionFormSchema` as-is                                           |
| Create   | `src/screens/add-section/formToInput.ts`                              | Port as-is                                                               |
| Create   | `src/screens/add-section/addSection.gql`                              | Port as-is; run codegen                                                  |
| Create   | `src/screens/add-section/useAddSection.ts`                            | Port; calls `resetDraft` on success                                      |
| Create   | `src/screens/add-section/resetToDescentForm.ts`                       | Port; references flattened `DESCENT_FORM_SECTION` (not `DESCENT_FORM`)  |
| Create   | `src/screens/add-section/SubmitButton.tsx`                            | Port; uses `useFormikContext`; renders as `Appbar.Action`-style button   |
| Create   | `src/screens/add-section/AddSectionTabsScreen.tsx`                    | Formik shell + `FormikToDraftSync` + `<AddSectionTabs />`                |
| Modify   | `src/screens/add-section/AddSectionTabs.tsx`                          | Wire real tab screens (replaced from mock)                               |
| Delete   | `src/screens/add-section/AddSectionStack.tsx`                         | Replaced by flattened RootStack entries                                  |
| Modify   | `src/core/navigation/screen-names.ts`                                 | Remove `ADD_SECTION_SCREEN`                                              |
| Modify   | `src/core/navigation/navigation-params.ts`                            | Remove `ADD_SECTION_SCREEN` + `AddSectionStackParamsList`; add photo params |
| Modify   | `src/core/navigation/RootStack.tsx`                                   | Replace `ADD_SECTION_SCREEN` with 5 flat entries; add `UploadsProvider` import |
| Modify   | `src/App.tsx`                                                         | Add `UploadsProvider` inside `ApolloProvider`; add `AddSectionDraftProvider` inside `AuthProvider` |

### Validation

- [ ] `pnpm tsc --noEmit` clean from `apps/mobile2/`
- [ ] App launches; drawer → Add Section navigates to tabs (placeholder tab bodies shown)
- [ ] Draft provider mounts; `useAddSectionDraft()` returns non-null context in tab screens

---

## 9.6.2 — Main, Attributes, Description, Flows tabs

**Goal:** the four primary-data tabs are real and functional. Navigation to RIVER/GAUGE/SHAPE from inside tabs works (lands on placeholder screens). Season numeric picker works. Keyboard avoidance works on all four tabs.

### Files to create

| File                                                                    | Notes                                                                                                       |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `src/screens/add-section/utils/index.ts`                                | Port `getShapeError` + other helpers from `utils/shapeUtils.ts`                                             |
| `src/screens/add-section/main/MainScreen.tsx`                           | Replace `KeyboardAwareScrollView` from `keyboard-aware-scroll-view` with one from `keyboard-controller`     |
| `src/screens/add-section/main/RiverPlaceholder.tsx`                     | Port as-is                                                                                                  |
| `src/screens/add-section/main/PiToPlaceholder.tsx`                      | Port as-is                                                                                                  |
| `src/screens/add-section/main/index.ts`                                 | Re-export                                                                                                   |
| `src/screens/add-section/attributes/AttributesScreen.tsx`               | Replace `KeyboardAwareScrollView`; add `CheckboxField` for `hidden` / `helpNeeded`                          |
| `src/screens/add-section/attributes/index.ts`                           | Re-export                                                                                                   |
| `src/screens/add-section/description/DescriptionScreen.tsx`             | Replace `FullScreenKAV` with `KeyboardAvoidingView` from `keyboard-controller`; add `KeyboardToolbar`       |
| `src/screens/add-section/description/index.ts`                          | Re-export                                                                                                   |
| `src/screens/add-section/flows/FlowsScreen.tsx`                         | Replace `listenToKeyboardEvents` hack with `KeyboardAwareScrollView` from `keyboard-controller`             |
| `src/screens/add-section/flows/GaugePlaceholder.tsx`                    | Port as-is; navigate to `ADD_SECTION_GAUGE` using tab navigator's parent navigation                         |
| `src/screens/add-section/flows/season/SeasonNumeric.tsx`                | Port as-is                                                                                                  |
| `src/screens/add-section/flows/season/SeasonNumericField.tsx`           | Port as-is                                                                                                  |
| `src/screens/add-section/flows/season/Month.tsx`                        | Port as-is                                                                                                  |
| `src/screens/add-section/flows/season/HalfMonth.tsx`                    | Port as-is                                                                                                  |
| `src/screens/add-section/flows/season/useGestures.ts`                   | Port as-is                                                                                                  |
| `src/screens/add-section/flows/season/index.ts`                         | Re-export                                                                                                   |
| `src/screens/add-section/flows/index.ts`                                | Re-export                                                                                                   |

Also update `AddSectionTabs.tsx` to use the real screen components.

### Keyboard handling

| Tab             | Handling                                                                                |
| --------------- | --------------------------------------------------------------------------------------- |
| **Main**        | `KeyboardAwareScrollView` (bottomOffset 35) + `KeyboardToolbar`                         |
| **Attributes**  | `KeyboardAwareScrollView`; TagsField modal has no keyboard overlap                      |
| **Description** | `KeyboardAvoidingView behavior="padding"` from `keyboard-controller` + `KeyboardToolbar` with Done |
| **Flows**       | `KeyboardAwareScrollView` (bottomOffset 35) + `KeyboardToolbar`                         |

### Validation

- [ ] All four tabs render without errors
- [ ] `pnpm tsc --noEmit` clean
- [ ] Main tab: river placeholder navigates to (placeholder) River screen; Pi-To placeholders navigate to (placeholder) Shape screen
- [ ] Flows tab: season numeric picker renders and responds to gestures; gauge placeholder navigates to (placeholder) Gauge screen
- [ ] Description tab: multiline field expands, keyboard pushes content up

---

## 9.6.3 — Photos tab + Photo edit screen

**Goal:** users can add photos via image picker, see upload progress thumbnails, navigate to an individual photo-edit screen to set caption / copyright / license, and mark photos for deletion.

### Files to create

| File                                                           | Notes                                                                              |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `src/screens/add-section/photos/PhotosScreen.tsx`             | Port; uses `useImagePicker` + `PhotoUploadField` from `forms/photo-upload`         |
| `src/screens/add-section/photos/AddPhotoButton.tsx`           | Port as-is                                                                         |
| `src/screens/add-section/photos/PhotoThumb.tsx`               | Port; wraps `LocalPhotoView` from `components/photo-picker`                        |
| `src/screens/add-section/photos/useRemovePhoto.ts`            | Port as-is                                                                         |
| `src/screens/add-section/photos/index.ts`                     | Re-export                                                                          |
| `src/screens/add-section/photo/PhotoScreen.tsx`               | Port; receives `{ index, localPhotoId }` from RootStack params                     |
| `src/screens/add-section/photo/SectionPhotoForm.tsx`          | Port; uses `TextField` + `ModalPickerField` for copyright/license                  |
| `src/screens/add-section/photo/BackButton.tsx`                | Port as-is; renders as `headerRight` via `setOptions`; sets `headerLeft: null`     |
| `src/screens/add-section/photo/useKeyboard.ts`                | Port as-is                                                                         |
| `src/screens/add-section/photo/index.ts`                      | Re-export                                                                          |

Update `AddSectionTabs.tsx` to use `PhotosScreen`.

### Keyboard handling

| Screen  | Handling                                                      |
| ------- | ------------------------------------------------------------- |
| Photos  | No text input — n/a                                           |
| Photo   | `KeyboardAwareScrollView` (bottomOffset 35) + `KeyboardToolbar` |

### Validation

- [ ] Photos tab: add button opens image picker; selected photo shows as thumbnail with upload progress indicator
- [ ] Tapping thumbnail navigates to Photo edit screen
- [ ] Photo edit screen: caption + copyright + license fields editable; back button returns to Photos tab with changes reflected
- [ ] `pnpm tsc --noEmit` clean

---

## 9.6.4 — River + Gauge modal screens

**Goal:** users can search for and select a river (or create new); users can search for and select a gauge (or create new via dialog). Both screens write to the draft on selection and `goBack()`.

### Files to create

| File                                                         | Notes                                                                              |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `src/screens/add-section/river/RiverScreen.tsx`             | Port; search input + `FlashList` of results; selection writes `draft.river`        |
| `src/screens/add-section/river/RiversListItem.tsx`          | Port as-is                                                                         |
| `src/screens/add-section/river/RiversListItemBody.tsx`      | Port as-is                                                                         |
| `src/screens/add-section/river/RiversListRiverItem.tsx`     | Port as-is                                                                         |
| `src/screens/add-section/river/RiversListSection.tsx`       | Port as-is                                                                         |
| `src/screens/add-section/river/RiversListSeparator.tsx`     | Port as-is                                                                         |
| `src/screens/add-section/river/useRiversSearch.tsx`         | Port; use `useAddSectionRegion()` from draft context                               |
| `src/screens/add-section/river/findRivers.gql`              | Port as-is; run codegen                                                            |
| `src/screens/add-section/river/index.ts`                    | Re-export                                                                          |
| `src/screens/add-section/gauge/GaugeScreen.tsx`             | Port; search input + `FlashList` + create-gauge dialog                             |
| `src/screens/add-section/gauge/GaugeListHeader.tsx`         | Port as-is                                                                         |
| `src/screens/add-section/gauge/GaugesListItem.tsx`          | Port as-is                                                                         |
| `src/screens/add-section/gauge/GaugesListSeparator.tsx`     | Port as-is                                                                         |
| `src/screens/add-section/gauge/EmptyListPlaceholder.tsx`    | Port as-is                                                                         |
| `src/screens/add-section/gauge/useGaugesQuery.ts`           | Port; use `useAddSectionRegion()`                                                  |
| `src/screens/add-section/gauge/findGauges.gql`              | Port as-is; run codegen                                                            |
| `src/screens/add-section/gauge/index.ts`                    | Re-export                                                                          |

**Draft↔Formik sync for river/gauge:** each screen calls `setDraft` before `goBack()`. The tabs screen's `useFocusEffect` calls `setFieldValue('river', draft.river)` / `setFieldValue('gauge', draft.gauge)` when it regains focus and the draft value differs from Formik's current value.

Replace `FlatList` with `FlashList` (consistent with Phase 6).

### Keyboard handling

| Screen | Handling                                                            |
| ------ | ------------------------------------------------------------------- |
| River  | `KeyboardAvoidingView` wrapping search bar; list scrolls freely     |
| Gauge  | `KeyboardAvoidingView`; create dialog uses Paper `Dialog`           |

### Validation

- [ ] River screen: typing filters list; selecting a river writes it to draft and returns to Main tab showing the river name
- [ ] Gauge screen: typing filters list; selecting a gauge writes it to draft and returns to Flows tab showing the gauge name; create-new dialog creates gauge via mutation and selects it
- [ ] `pnpm tsc --noEmit` clean

---

## 9.6.5 — Shape screen (PiToMap + PiToControl + dialog)

**Goal:** users can place Put-In and Take-Out coordinates on a map, enter them manually via dialog (with clipboard support), and commit the shape to the draft.

### Files to create

| File                                                          | Notes                                                                              |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `src/screens/add-section/shape/ShapeScreen.tsx`              | Port; sets `headerRight: <DoneButton />` via `setOptions`; writes shape to draft on Done |
| `src/screens/add-section/shape/PiToMap.tsx`                  | Port; wraps `MapboxGL.MapView` + markers for put-in / take-out                     |
| `src/screens/add-section/shape/PiToOverlay.tsx`              | Port as-is; HUD showing current coords above the map                               |
| `src/screens/add-section/shape/PiToControl.tsx`              | Port as-is; bottom sheet with Put-In / Take-Out toggle buttons                     |
| `src/screens/add-section/shape/PiToField.tsx`                | Port as-is; renders one coordinate row                                             |
| `src/screens/add-section/shape/DoneButton.tsx`               | Port as-is; `Appbar.Action`; disabled until both coords set                        |
| `src/screens/add-section/shape/usePiToState.ts`              | Port as-is; local state machine for Put-In / Take-Out selection                    |
| `src/screens/add-section/shape/notifier.ts`                  | Port as-is                                                                         |
| `src/screens/add-section/shape/dialog/PiToDialog.tsx`        | Port; Paper `Dialog` with coordinate text fields + clipboard support               |
| `src/screens/add-section/shape/dialog/PiToDialogContent.tsx` | Port as-is                                                                         |
| `src/screens/add-section/shape/dialog/PiToPointHeader.tsx`   | Port as-is                                                                         |
| `src/screens/add-section/shape/dialog/useClipboardCoordinate.tsx` | Port as-is                                                                    |
| `src/screens/add-section/shape/dialog/validation.ts`         | Port as-is                                                                         |
| `src/screens/add-section/shape/dialog/index.ts`              | Re-export                                                                          |
| `src/screens/add-section/shape/index.ts`                     | Re-export                                                                          |

**Draft↔Formik sync for shape:** `ShapeScreen` calls `setDraft((d) => ({ ...d, shape: piToState.shape }))` before navigating back. The tabs screen's `useFocusEffect` calls `setFieldValue('shape', draft.shape)`.

**Note:** Shape screen has no keyboard input — no keyboard handling needed.

### Validation

- [ ] Shape screen opens with existing put-in / take-out markers if already set in draft
- [ ] Tapping map sets the active point; DoneButton enables when both points are set
- [ ] Manual entry dialog accepts lat/lng text or paste from clipboard
- [ ] Done → returns to Main tab with Pi-To placeholder fields showing the coordinates
- [ ] `pnpm tsc --noEmit` clean

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
