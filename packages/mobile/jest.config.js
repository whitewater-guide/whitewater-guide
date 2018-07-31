const { readdirSync } = require('fs');
const reactNativeModules = readdirSync('./node_modules')
  .filter((pkg) => pkg.indexOf('react-native') === 0);

const notIgnoredModules = [
  ...reactNativeModules,
  'apollo-client',
  'redux-persist-fs-storage',
  'glamorous-native',
].join('|');

module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js',
  },
  testMatch: [
    '**/__tests__/**/*.js?(x)',
    '**/?(*.)+(spec|test).js?(x)',
    '**/__tests__/**/*.ts?(x)',
    '**/?(*.)+(spec|test).ts?(x)',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/ww-commons/',
    '<rootDir>/src/ww-clients/',
  ],
  moduleFileExtensions: ['js', 'json', 'jsx', 'node', 'ts', 'tsx'],
  transformIgnorePatterns: [
    `node_modules/(?!(${notIgnoredModules})/)`,
  ],
  setupTestFrameworkScriptFile: '<rootDir>/jest.setup.ts',
  cacheDirectory: '.jest/cache',
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
  reporters: [
    'default',
    'jest-summary-reporter',
  ],
};
