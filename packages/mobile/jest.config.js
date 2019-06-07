const { readdirSync } = require('fs');
const reactNativeModules = readdirSync('./node_modules').filter(
  (pkg) => pkg.indexOf('react-native') === 0,
);

const notIgnoredModules = [
  ...reactNativeModules,
  'apollo-client',
  'redux-persist-fs-storage',
].join('|');

module.exports = {
  preset: 'react-native',
  verbose: true,
  // transform: {
  //   '^.+\\.(j|t)sx?$':
  //     '<rootDir>/node_modules/react-native/jest/preprocessor.js',
  // },
  transformIgnorePatterns: [`node_modules/(?!(${notIgnoredModules})/)`],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
