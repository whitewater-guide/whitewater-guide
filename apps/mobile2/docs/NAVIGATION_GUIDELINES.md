# Navigation Guidelines

## File layout per screen folder

Every registered screen must have a colocated `navigation-types.ts`:

- `navigation-types.ts` — **required**, contains **only** navigation types for that screen.
- `<ScreenName>.tsx` — imports and uses the screen props type from `navigation-types.ts`. If the screen doesn't use `navigation` or `route`, declare the props as `_: <ScreenName>ScreenProps`.

## Naming

- Navigator param maps: `<Feature>StackParamsList` / `<Feature>TabsParamsList`.
- Screen prop types: `<ScreenName>ScreenProps` (e.g., `RegionInfoScreenProps`).
- ParamsList type declarations require `// eslint-disable-next-line @typescript-eslint/consistent-type-definitions` (index signatures require `type`, not `interface`).

## Composition with CompositeScreenProps

Nested screens (e.g., a tab inside a stack inside another stack) must use `CompositeScreenProps`:

```ts
// apps/mobile2/src/screens/add-section/photos/navigation-types.ts
export type AddSectionPhotosScreenProps = CompositeScreenProps<
  MaterialTopTabScreenProps<
    AddSectionTabsParamsList,
    Screens.ADD_SECTION_PHOTOS
  >,
  AddSectionTabsScreenProps // second arg is the parent ScreenProps (already composed)
>;
```

Only one level of composition is needed — the parent `*ScreenProps` already chains recursively.

**Parent navigator files**: for each feature with a sub-navigator, group at the feature folder level:

- The param map(s).
- The "entry" `*ScreenProps` for the RootStack-level screen hosting the sub-navigator.
- Intermediate `*ScreenProps` for sub-navigator screens that themselves have children (e.g., `RegionTabsScreenProps`).

See [add-section/navigation-types.ts](../src/screens/add-section/navigation-types.ts) as a reference.

**Drawer caveat**: RootStack screens are NOT composed with `RootDrawerParamsList`. The drawer contains only one screen (`ROOT_STACK`), so drawer actions resolve automatically up the tree; composition would add noise without benefit.

## Navigation prop vs `useNavigation`

- **Registered screens** (anything passed as `component={…}` to `Stack.Screen` / `Tab.Screen`): receive `navigation` as a prop — use it directly, never call `useNavigation` inside the component.
- **Sub-components, hooks, list items, FABs, header buttons**: call `useNavigation<<ParentScreen>ScreenProps['navigation']>()`, where `<ParentScreen>` is the registered screen the component/hook is rendered under. For sub-navigator screens that already use `CompositeScreenProps`, the composite `*ScreenProps['navigation']` is the type to use — composition exposes the parent stack's navigate calls through the same prop. Do not thread `navigation` down as a plain prop to avoid the hook. If a component is genuinely shared across multiple screens, type it against the closest common owner (the lowest screen all call sites live under) — falling back to `NativeStackNavigationProp<RootStackParamsList>` only when there is no shared owner.
- **Components outside `src/screens/`** (e.g. `src/components/`): must **not** import navigation types from any `screens/*/navigation-types` file — doing so risks a circular dependency (`components → screens → components`). Use `NativeStackNavigationProp<RootStackParamsList>` from `core/navigation` directly. If a component genuinely belongs to a single screen, co-locate it next to that screen instead.

## Screen options typing

When defining screen options as a constant, always annotate the type explicitly using the appropriate navigation options type. For example

```tsx
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

const screenOptions: NativeStackNavigationOptions = {
  // ...options
};

// Then
<Stack.Navigator screenOptions={screenOptions} />;
```
