/* eslint-disable @typescript-eslint/no-var-requires */
const blacklist = require('metro-config/src/defaults/blacklist');
const path = require('path');

// https://medium.com/@huntie/a-concise-guide-to-configuring-react-native-with-yarn-workspaces-d7efa71b6906
module.exports = {
  watchFolders: [
    path.resolve(__dirname, '../..', 'node_modules'),
    path.resolve(__dirname, '..', 'commons'),
    path.resolve(__dirname, '..', 'clients'),
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
    blacklistRE: blacklist([/mobile\/node_modules\/react\/.*/]),
  },
};
