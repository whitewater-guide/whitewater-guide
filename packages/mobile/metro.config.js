/* eslint-disable @typescript-eslint/no-var-requires */
const blacklist = require('metro-config/src/defaults/exclusionList');
const path = require('path');

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
    blockList: blacklist([/mobile\/node_modules\/react\/.*/]),
  },
};
