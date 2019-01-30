module.exports = {
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  setupTestFrameworkScriptFile:
    '<rootDir>/src/test/setupTestFrameworkScriptFile.ts',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testEnvironment: 'node',
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
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
};
