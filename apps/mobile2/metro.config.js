const path = require('path');
const { getDefaultConfig } = require('@react-native/metro-config');
const { withSentryConfig } = require('@sentry/react-native/metro');
const {
  withStorybook,
} = require('@storybook/react-native/metro/withStorybook');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
// see https://www.callstack.com/blog/react-native-monorepo-with-pnpm-workspaces
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
config.resolver.disableHierarchicalLookup = true;

if (process.env.E2E_MODE === 'true') {
  config.resolver.sourceExts = [
    'mock.tsx',
    'mock.ts',
    ...config.resolver.sourceExts,
  ];
}

module.exports = withSentryConfig(
  withStorybook(config, {
    enabled: process.env.STORYBOOK_ENABLED === 'true',
    configPath: path.resolve(projectRoot, '.rnstorybook'),
  }),
);
