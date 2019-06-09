const { readdirSync } = require('fs');

const excludedModules = readdirSync('./node_modules').filter(
  (pkg) =>
    pkg.indexOf('react-native') === 0 ||
    pkg.indexOf('victory-') === 0 ||
    pkg.indexOf('react-navigation') >= 0,
);

const notIgnoredModules = [
  ...excludedModules,
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
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.ts',
    '<rootDir>/node_modules/react-native-gesture-handler/jestSetup.js',
  ],
  testPathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/node_modules/'],
};
