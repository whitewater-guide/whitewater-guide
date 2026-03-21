/** @type {import('../../dist').JestConfigWithTsJest} */
module.exports = {
  displayName: require('./package.json').name,
  preset: 'ts-jest/presets/default',
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        isolatedModules: true,
      },
    ],
  },
  setupFiles: ['dotenv-flow/config'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'node',
  snapshotSerializers: ['<rootDir>/src/test/knexJestSnapshot.ts'],
  reporters: ['default', 'jest-summary-reporter'],
  moduleFileExtensions: ['ts', 'js', 'json'],
};
