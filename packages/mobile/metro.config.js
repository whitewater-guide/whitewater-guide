/* eslint-disable @typescript-eslint/no-var-requires */
const blacklist = require('metro-config/src/defaults/exclusionList');
const path = require('path');
const { getDefaultConfig } = require('metro-config');
const { resolver: defaultResolverConfig } = getDefaultConfig.getDefaultValues();
const defaultResolver = require('metro-resolver');

// https://medium.com/@huntie/a-concise-guide-to-configuring-react-native-with-yarn-workspaces-d7efa71b6906
module.exports = {
  watchFolders: [
    path.resolve(__dirname, '../..', 'node_modules'),
    path.resolve(__dirname, '..', 'commons'),
    path.resolve(__dirname, '..', 'clients'),
    path.resolve(__dirname, '..', 'schema'),
    path.resolve(__dirname, '..', 'validation'),
  ],
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    ...defaultResolverConfig,
    // https://github.com/apollographql/apollo-client/blob/main/CHANGELOG.md#apollo-client-354-2021-11-19
    sourceExts: [...defaultResolverConfig.sourceExts, 'cjs'],
    blockList: blacklist([/mobile\/node_modules\/react\/.*/]),
    resolveRequest: (context, realModuleName, platform) => {
      const { resolveRequest: _removed, ...ctx } = context;
      if (realModuleName === '@gorhom/bottom-sheet') {
        const resolved = defaultResolver.resolve(ctx, realModuleName, platform);
        return {
          ...resolved,
          filePath: resolved.filePath.replace('commonjs', 'module'),
        };
      }
      return defaultResolver.resolve(ctx, realModuleName, platform);
    },
  },
};
