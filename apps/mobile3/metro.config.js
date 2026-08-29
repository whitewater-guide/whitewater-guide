const { getDefaultConfig } = require('expo/metro-config');
const {
  withStorybook,
} = require('@storybook/react-native/metro/withStorybook');

const storybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// EXPO_PUBLIC_* is inlined at transform time; keep app vs Storybook caches separate
// so Android does not reuse a bundle from `pnpm start`.
config.cacheVersion = `${config.cacheVersion}:sb:${storybookEnabled}`;

module.exports = withStorybook(config, {
  enabled: storybookEnabled,
  configPath: './.rnstorybook',
  liteMode: true,
});
