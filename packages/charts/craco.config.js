const CopyWebpackPlugin = require('copy-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  eslint: {
    enable: false,
  },
  typescript: {
    enableTypeChecking: false,
  },
  babel: {
    plugins: [
      '@babel/plugin-proposal-export-namespace-from',
      'react-native-reanimated/plugin',
    ],
  },
  webpack: {
    plugins: {
      add: [
        new NodePolyfillPlugin({
          includeAliases: ['fs', 'path'],
        }),
        new CopyWebpackPlugin({
          patterns: [
            { from: '../../node_modules/canvaskit-wasm/bin/canvaskit.wasm' },
          ],
        }),
      ],
    },
    // resolve: {
    alias: { 'react-native$': 'react-native-web' },
    // extensions: ['.web.js', '.js'],
    // },
    configure: (config, { env, paths }) => {
      config.resolve.fallback = {
        fs: false,
      };
      // console.log(config);
      // process.exit(1);
      return config;
    },
  },
};
