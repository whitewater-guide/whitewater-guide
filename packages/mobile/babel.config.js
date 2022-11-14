module.exports = {
  presets: ['@rnx-kit/babel-preset-metro-react-native'],
  plugins: [
    './scripts/babel', // this plugin provides package.json version
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '~': './src',
        },
        cwd: 'packagejson',
      },
    ],
    'lodash',
    'react-native-reanimated/plugin',
  ],
};
