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
  '@react-native-mapbox-gl/maps',
  '@react-native-community/async-storage',
].join('|');

module.exports = {
  preset: '@testing-library/react-native',
  verbose: true,
  // transform: {
  //   '^.+\\.(j|t)sx?$':
  //     '<rootDir>/node_modules/react-native/jest/preprocessor.js',
  // },
  transformIgnorePatterns: [`node_modules/(?!(${notIgnoredModules})/)`],
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.ts',
    '<rootDir>/jest-mapbox.setup.ts',
    '<rootDir>/node_modules/react-native-gesture-handler/jestSetup.js',
    '<rootDir>/node_modules/@testing-library/react-native/cleanup-after-each',
  ],
  reporters: ['default', 'jest-summary-reporter'],
  testPathIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/e2e/',
    '<rootDir>/node_modules/',
  ],
};
