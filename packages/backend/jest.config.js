module.exports = {
  // globals: {
  //   'ts-jest': {
  //     isolatedModules: true
  //   }
  // },
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testEnvironment: 'node',
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx)$',
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'json'
  ],
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
    '^@ww-commons(.*)$': '<rootDir>/src/ww-commons$1'
  },
  snapshotSerializers: [
    'jest-serializer-sql'
  ],
  reporters: [
    'default',
    'jest-summary-reporter'
  ]
};
