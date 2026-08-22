# @whitewater-guide/mobile

Expo SDK 57 rewrite of the whitewater.guide mobile app (`apps/mobile3`). Native iOS/Android projects are generated with Continuous Native Generation (`expo prebuild`); do not commit `ios/` or `android/`.

Store identity matches the legacy app: bundle id / application id `guide.whitewater`.

```bash
pnpm start          # Metro bundler
pnpm ios            # prebuild + run on iOS simulator
pnpm android        # prebuild + run on Android emulator
```
