/* eslint-disable @typescript-eslint/no-var-requires */
const { readdirSync } = require('fs');
const { defaults } = require('jest-config');

const excludedModules = [
  ...readdirSync('./node_modules'),
  ...readdirSync('../../node_modules'),
].filter(
  (pkg) =>
    pkg.includes('react-native') ||
    // pkg.indexOf('victory-') === 0 ||
    pkg.includes('react-navigation'),
);

const notIgnoredModules = [...excludedModules, '@apollo/client'].join('|');

module.exports = {
  displayName: require('./package.json').name,
  preset: 'react-native',
  verbose: true,
  moduleNameMapper: {
    '~/(.*)': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [`node_modules/(?!(${notIgnoredModules}))`],
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.ts',
    '<rootDir>/jest-mapbox.setup.ts',
    '<rootDir>/node_modules/react-native-gesture-handler/jestSetup.js',
  ],
  reporters: ['default', 'jest-summary-reporter'],
  testPathIgnorePatterns: [
    ...defaults.testPathIgnorePatterns,
    '<rootDir>/build/',
    '<rootDir>/e2e/',
    '<rootDir>/node_modules/',
  ],
  modulePathIgnorePatterns: ['mobile/node_modules/react/.*'],
};
