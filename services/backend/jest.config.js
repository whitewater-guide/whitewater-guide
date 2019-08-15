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
    '^@apollo$': '<rootDir>/src/apollo',
    '^@auth$': '<rootDir>/src/auth',
    '^@db(.*)$': '<rootDir>/src/db$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@log$': '<rootDir>/src/log',
    '^@minio$': '<rootDir>/src/minio',
    '^@redis$': '<rootDir>/src/redis',
    '^@seeds/(.*)$': '<rootDir>/src/seeds/test/$1',
    '^@test$': '<rootDir>/src/test',
    '^@utils$': '<rootDir>/src/utils',
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
