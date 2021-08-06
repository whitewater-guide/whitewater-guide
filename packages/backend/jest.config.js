/* eslint-disable @typescript-eslint/no-var-requires */
const { defaults } = require('jest-config');

module.exports = {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
  displayName: require('./package.json').name,
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  setupFiles: ['dotenv-flow/config'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '~/(.*)': '<rootDir>/src/$1',
    '@test': '<rootDir>/test/index.ts',
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
