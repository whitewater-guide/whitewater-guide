const path = require('path');
const metro = require('metro');

module.exports = {
  watchFolders: [
    path.join(process.cwd(), '../clients'),
    path.join(process.cwd(), '../commons'),
  ],
  resolver: {
    extraNodeModules: new Proxy(
      {},
      {
        get: (target, name) => path.join(process.cwd(), `node_modules/${name}`),
      },
    ),
    blacklistRE: metro.createBlacklist([
      /@whitewater-guide\/commons\/node_modules\/react-native\/.*/,
      /@whitewater-guide\/clients\/node_modules\/react-native\/.*/,
      /@whitewater-guide\/clients\/node_modules\/react\/.*/,
      new RegExp(path.join(process.cwd(), '../clients/node_modules/') + '.*'),
      new RegExp(path.join(process.cwd(), '../commons/node_modules/') + '.*'),
    ]),
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  // server: {
  //   enableVisualizer: true,
  // },
};
