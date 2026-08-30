# mobile3

Expo SDK 57 app (`expo-router`) replacing `mobile2`. Follow this file when implementing Storybook plan steps. Do **not** load `expo-overview`, `expo-dev-client`, or `expo-ui` unless the current commit’s package list introduces an Expo API that is not already in `package.json`.

## Commands

Run from this directory.

```bash
npx expo install <pkg>          # SDK 57 pin — never pnpm add for Expo modules
pnpm tsc --noEmit               # typecheck THIS app only; ignore errors outside apps/mobile3
pnpm start                      # tabs app (Storybook stripped)
pnpm storybook                  # Storybook Metro, development build
pnpm storybook:ios              # Storybook on iOS simulator
pnpm storybook:android          # Storybook on Android emulator
pnpm ios / pnpm android         # rebuild + launch development client
```

Do not run root `pnpm typecheck` to validate a mobile3 change. If `expo install` cannot patch TypeScript `app.config.ts`, add config plugins by hand.

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
