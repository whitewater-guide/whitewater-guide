# mobile3

Expo SDK 57 app (`expo-router`) replacing `mobile2`. Follow this file when implementing Storybook plan steps. Do **not** load `expo-overview`, `expo-dev-client`, or `expo-ui` unless the current commit’s package list introduces an Expo API that is not already in `package.json`.

## Commands

Put `cd` in the shell command itself. Do not rely on the tool `working_directory` — it may still be the repo root.

```bash
cd apps/mobile3

npx expo install <pkg>          # SDK 57 pin — never pnpm add for Expo modules
pnpm tsc --noEmit               # typecheck THIS app only (uses this package’s tsconfig)
pnpm start                      # tabs app (Storybook stripped)
pnpm storybook                  # Storybook Metro, development build
pnpm storybook:ios              # Storybook on iOS simulator
pnpm storybook:android          # Storybook on Android emulator
pnpm ios / pnpm android         # rebuild + launch development client
```

A correct typecheck is a few seconds with almost no stdout. If the log mentions `apps/backend`, `packages/schema`, “React UMD global”, or missing `@/` modules, **cwd was the repo root** — stop; do not fix those errors.

- Do **not** run root `pnpm typecheck` (it is recursive: `pnpm --recursive … run typecheck`).
- Do **not** use `npx tsc` — `pnpm tsc --noEmit` after `cd apps/mobile3` is the pinned TypeScript for this app.
- Ignore type errors outside `apps/mobile3`.

If `expo install` cannot patch TypeScript `app.config.ts`, add config plugins by hand.

## Install

- Expo / native modules: `cd apps/mobile3 && npx expo install <pkg>` with network (or `all`) permissions. Sandbox-only network will 403.
- Workspace packages: quote the spec and stay in this package, e.g. `pnpm add "@whitewater-guide/schema@workspace:*" --ignore-scripts --filter @whitewater-guide/mobile`. zsh glob-expands an unquoted `*`. `--ignore-scripts` skips root `prepare` (codegen + build of every package).
- Do not set `CI=true` on an install that must update the lockfile (`CI` implies frozen lockfile).
- Do not add `@whitewater-guide/clients` until Apollo is an intentional dependency. It re-exports Apollo, charts, and generated ops. Copy tiny helpers instead.
- After install, read `node_modules/<pkg>/build/*.d.ts`. Do not WebFetch Expo docs. Do not re-read `.rnstorybook/*`, `theme.ts`, or existing smoke tests except the clipboard template.

## Storybook

- Stories: colocated `*.stories.tsx` next to the component. Smoke tests: `src/storybook/smoke-tests/`.
- Glob is already `../src/**/*.stories.?(ts|tsx)` in `.rnstorybook/main.ts` — do not re-read Storybook config unless this commit changes it.
- Smoke-test template: copy [`src/storybook/smoke-tests/clipboard.stories.tsx`](src/storybook/smoke-tests/clipboard.stories.tsx). Reuse [`story-ui.tsx`](src/storybook/smoke-tests/story-ui.tsx) (`StoryButton`, `InfoRow`, `formatNullable`). Title prefix: `Dependencies Smoke Tests/<Name>`.
- Last-opened story is persisted with MMKV instance `storybook-ui` in [`.rnstorybook/index.ts`](.rnstorybook/index.ts). Do not re-wire storage.
- Add an `app.config.ts` plugin only if the package has `app.plugin.js` **and** Expo did not auto-apply it.

## Native vs Expo Go

Scripts already pass `--dev-client`. Never start Metro with plain `expo start` — Expo Go does not include MMKV/Nitro, Gorhom, Mapbox, or Skia.

`ios/` and `android/` are gitignored (CNG). After a **new native module**:

Rebuild **both** platforms before calling the step done (`pnpm ios` and `pnpm android`, or `npx expo run:android --no-bundler` if Storybook Metro is already running).

JS-only commits do not need a native rebuild.

## Smoke tests

Keep them the minimum interaction that proves the native module loads. Do not invent extra instances, design-system kits, or helpers beyond `story-ui.tsx`.

## Porting from mobile2

RN 0.86 / Reanimated 4 / Expo replacements (do not copy these APIs 1:1):

- `StyleSheet.absoluteFillObject` → `StyleSheet.absoluteFill` or explicit absolute insets
- `Extrapolate.CLAMP` → `Extrapolation.CLAMP` from `react-native-reanimated`
- No Paper, NetInfo, AsyncStorage, or `@react-native-vector-icons/*` — use `ThemedText`, `expo-network`, `react-native-mmkv`, `expo-symbols` / `@expo/vector-icons`
- i18next `resources` bundles need a string index signature to satisfy `Resource`
