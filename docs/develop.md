# Development

This document describes how to install, assemble and launch everything on development machine.

## Step-by-step

1. Chechout project from github
2. Install node.js + npm (with es2017 support), android studio and android sdk, meteor, docker, watchman, gulp, etc...
3. Run `yarn` in `commons`, `web-client`, `mobile-client`
4. Copy env files with secrets, api keys, etc: 
  - For `backend` that would be meteor's `settings.development.json` and `settings.production.json`
  - For `web-client` that would be webpack's `build-config/env.development.json` and `build-config/env.production.json`
  - For `mobile-client` that would be react-native-config's `.env`, `.env.development` and `.env.production`
    Also add secret mobile-center key: `mobile-client/android/app/src/main/assets/mobile-center-config.json` and `mobile-client/ios/whitewater/MobileCenter-Config.plist`
  - For `.docker` that would be `env/production.env`, `env/staging.env` and `mongodbbackup.prod.env`
5. Install wml: `sudo npm i -g wml`. Launch `init_wml.sh`. See about wml below.
6. Run `web-client` with this `yarn start`
7. Before starting mobile-client run `adb reverse tcp:3333 tcp:3333`
8. Init storybook for mobile `yarn run prestorybook` and `adb reverse tcp:7007 tcp:7007`
9. Run `mobile-client` with this `yarn start` and then `react-native run-ios` (or android)

## WML

It is difficult to set up shared component between web and mobile clients

See related discussion [here](https://github.com/facebookincubator/create-react-app/issues/1492)

I use [WML](https://github.com/wix/wml) here as least painful solution

Another possible solution would be to use `haul` when it will be more production-ready
