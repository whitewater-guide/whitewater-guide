const { defaults } = require('jest-config');

module.exports = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.ts'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '~/(.*)': '<rootDir>/src/$1',
  },
  snapshotSerializers: ['jest-serializer-sql'],
  reporters: ['default', 'jest-summary-reporter'],
  // removing jsx and tsx and putting ts first makes tests run  ~10% faster
  moduleFileExtensions: ['ts', 'js', 'json'],
  modulePathIgnorePatterns: [...defaults.modulePathIgnorePatterns, '/dist/'],
  testPathIgnorePatterns: [...defaults.testPathIgnorePatterns, '/dist/'],
  transformIgnorePatterns: [...defaults.transformIgnorePatterns, '/dist/'],
  watchPathIgnorePatterns: [...defaults.watchPathIgnorePatterns, '/dist/'],
};
