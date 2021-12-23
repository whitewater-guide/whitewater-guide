module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
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
