module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    './scripts/babel', // this plugin provides package.json version
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          components: './src/components',
          forms: './src/forms',
        },
        cwd: 'packagejson',
      },
    ],
    'lodash',
  ],
};
